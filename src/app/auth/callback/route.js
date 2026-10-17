import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const target = safeNext(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(target, request.url));
    }

    console.error("Supabase OAuth callback exchange failed:", error);
  }

  return NextResponse.redirect(new URL("/signin?error=oauth", request.url));
}
