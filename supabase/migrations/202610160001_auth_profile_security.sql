-- Run once in Supabase SQL Editor when migrating profile-based app roles.
-- Keep profile reads scoped to the signed-in user, and do not let users change role.

grant usage on schema public to authenticated;
grant select on table public.profiles to authenticated;

revoke update on table public.profiles from authenticated;
grant update (name, phone) on table public.profiles to authenticated;

drop policy if exists "Authenticated users read profiles" on public.profiles;
drop policy if exists "Users read their own profile" on public.profiles;
create policy "Users read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users update their own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
