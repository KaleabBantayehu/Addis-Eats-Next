# Addis Eats Authentication and Authorization

## Identity and session flow

- Supabase Auth owns passwords, access tokens, refresh tokens, and sign-out.
- `src/app/actions/auth.js` performs sign-in with `signInWithPassword`, account creation with `signUp`, and local-session sign-out with `signOut({ scope: "local" })`.
- `src/lib/session.js` calls `auth.getClaims()` to verify the token, then reads only the caller's `profiles` row to obtain the app name and role. The role is never read from user-editable metadata.
- `src/lib/supabase/proxy.js` uses the `@supabase/ssr` cookie adapter and `auth.getClaims()` to refresh tokens. `src/proxy.js` applies that refresh flow across app requests and redirects signed-out users away from protected pages.
- Route pages, Server Actions, and Route Handlers still check identity, ownership, and role themselves. Proxy is a session refresh and early redirect layer, not the only authorization boundary.

## Roles

Sign-ups must receive the database default `customer` role. Do not accept a role from a form or `user_metadata`. Assign `staff` and `admin` only through a trusted database/admin operation. The migration at `supabase/migrations/202610160001_auth_profile_security.sql` restricts profile reads to the row owner and prevents users from changing `role` through the Data API.

The app expects `public.profiles` to use `id` referencing `auth.users(id)`, and to contain `name`, `phone`, and `role` columns. A new-user trigger should populate the profile and let the database default role apply. If your existing column or policy names differ, adapt the SQL migration before running it.

## Environment

Set `NEXT_PUBLIC_SUPABASE_URL` to the project origin (for example, `https://<project-ref>.supabase.co`, without `/rest/v1`) and set `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. The publishable/anon key can be exposed to the browser only because RLS controls table access. Never add a Supabase service-role/secret key to a `NEXT_PUBLIC_` variable or client code.

## Authorization checkpoints

| Surface | Server-side check |
|---|---|
| `/checkout`, `/orders`, `/favorites` | Verified Supabase claims; pages and actions re-check with `getSession()` |
| `/dashboard` | `getSession()` and `session.role === "admin"` |
| `/kitchen` | `getSession()` and `session.role === "staff"` |
| Order details, APIs, and tracking | Verified identity and order ownership; staff/admin access only where explicitly allowed |
| `placeOrder`, cancellation, status updates, favorites actions | Each action re-checks identity, owner, role, and/or valid status transition at mutation time |

Use `auth.uid()` in Supabase RLS policies for database ownership checks. The server client carries the signed-in Supabase Auth cookie, so Postgres receives the authenticated JWT. The old custom `session` HMAC cookie and fixture profiles are no longer used.

Apply `supabase/migrations/202610160002_favorites_orders.sql` after the profile security migration. It creates the favorites and order tables, enables owner/staff RLS for reads, and exposes authenticated RPCs that validate ownership and order status transitions. `place_order` reads current available dish prices inside one database transaction; clients cannot insert or alter orders or order items directly.
