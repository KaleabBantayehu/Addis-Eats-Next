"use client";

import { createBrowserClient } from "@supabase/ssr";
import { createBuildPlaceholderClient } from "./build-placeholder";

let browserClient;

export function createClient() {
  if (browserClient) return browserClient;

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return createBuildPlaceholderClient();
    }

    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and a Supabase publishable/anon key before making requests.",
    );
  }

  browserClient = createBrowserClient(url, key);

  return browserClient;
}
