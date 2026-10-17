"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
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

export async function signInWithGoogle(formData) {
  const target = safeNext(readText(formData, "next"));
  const requestHeaders = await headers();
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost || requestHeaders.get("host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProto === "http" || forwardedProto === "https"
      ? forwardedProto
      : host?.startsWith("localhost") || host?.startsWith("127.0.0.1")
        ? "http"
        : "https";

  if (!configuredSiteUrl && !host) {
    console.error("Google sign-in could not determine the application origin.");
    redirect(`/signin?error=oauth&next=${encodeURIComponent(target)}`);
  }

  const siteUrl = (
    configuredSiteUrl || `${protocol}://${host}`
  ).replace(/\/$/, "");
  const callbackUrl = new URL("/auth/callback", siteUrl);
  callbackUrl.searchParams.set("next", target);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl.toString() },
  });

  if (error || !data.url) {
    console.error("Supabase Google sign-in failed:", error);
    redirect(`/signin?error=oauth&next=${encodeURIComponent(target)}`);
  }

  redirect(data.url);
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
