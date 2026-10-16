"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readText(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNext(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";

  try {
    const url = new URL(value, "https://addis-eats.invalid");
    return url.origin === "https://addis-eats.invalid"
      ? `${url.pathname}${url.search}${url.hash}`
      : "/";
  } catch {
    return "/";
  }
}

export async function signIn(formData) {
  const email = readText(formData, "email");
  const password = String(formData.get("password") ?? "");
  const target = safeNext(readText(formData, "next"));
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/signin?error=invalid&next=${encodeURIComponent(target)}`);
  }

  revalidatePath("/", "layout");
  redirect(target);
}

export async function signUp(formData) {
  const name = readText(formData, "name");
  const email = readText(formData, "email");
  const password = String(formData.get("password") ?? "");
  const target = safeNext(readText(formData, "next"));

  if (name.length < 2 || name.length > 80 || !email || password.length < 8) {
    redirect(`/signup?error=invalid&next=${encodeURIComponent(target)}`);
  }

  const supabase = await createClient();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(target)}`,
    },
  });

  if (error) {
    redirect(`/signup?error=signup&next=${encodeURIComponent(target)}`);
  }

  revalidatePath("/", "layout");
  if (data.session) redirect(target);

  // Supabase email confirmation is enabled: ask the user to verify before sign-in.
  redirect(`/signin?registered=1&next=${encodeURIComponent(target)}`);
}

export async function handleSignOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    console.error("Supabase sign-out failed:", error);
  }

  revalidatePath("/", "layout");
  redirect("/signin");
}
