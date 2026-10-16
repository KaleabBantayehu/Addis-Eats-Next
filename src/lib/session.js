import "server-only";

import { createClient } from "@/lib/supabase/server";

const VALID_ROLES = new Set(["customer", "staff", "admin"]);

export async function getSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) return null;

  const claims = data.claims;
  const userId = claims.sub;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("Could not load the signed-in user's profile:", profileError);
    return null;
  }

  const role = VALID_ROLES.has(profile?.role) ? profile.role : "customer";

  return {
    id: userId,
    name: profile?.name || claims.email || "Customer",
    email: typeof claims.email === "string" ? claims.email : "",
    role,
  };
}
