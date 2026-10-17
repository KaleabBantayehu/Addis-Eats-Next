create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  dish_id bigint not null references public.dishes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, dish_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  area text not null,
  notes text not null default '',
  status text not null default 'placed'
    check (status in ('placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled')),
  total numeric(12, 2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  dish_id bigint not null references public.dishes(id) on delete restrict,
  dish_name text not null,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity between 1 and 20),
  line_total numeric(12, 2) not null check (line_total = unit_price * quantity),
  created_at timestamptz not null default now()
);

create index if not exists orders_owner_created_at_idx
  on public.orders (owner_id, created_at desc);
create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

grant usage on schema public to authenticated;

alter table public.favorites enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Users read own favorites" on public.favorites;
create policy "Users read own favorites"
  on public.favorites for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users add own favorites" on public.favorites;
create policy "Users add own favorites"
  on public.favorites for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users remove own favorites" on public.favorites;
create policy "Users remove own favorites"
  on public.favorites for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users and staff read permitted orders" on public.orders;
create policy "Users and staff read permitted orders"
  on public.orders for select to authenticated
  using (
    (select auth.uid()) = owner_id
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('staff', 'admin')
    )
  );

drop policy if exists "Users and staff read permitted order items" on public.order_items;
create policy "Users and staff read permitted order items"
  on public.order_items for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.owner_id = (select auth.uid())
          or exists (
            select 1 from public.profiles p
            where p.id = (select auth.uid())
              and p.role in ('staff', 'admin')
          )
        )
    )
  );

grant select, insert, delete on public.favorites to authenticated;
grant select on public.orders, public.order_items to authenticated;
revoke insert, update, delete on public.orders, public.order_items from authenticated;

create or replace function public.place_order(
  p_name text,
  p_phone text,
  p_area text,
  p_notes text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_dish_id bigint;
  v_dish_name text;
  v_price numeric(12, 2);
  v_quantity integer;
  v_total numeric(12, 2) := 0;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to place an order.';
  end if;
  if length(trim(coalesce(p_name, ''))) < 2
      or length(trim(coalesce(p_name, ''))) > 80
      or length(trim(coalesce(p_phone, ''))) = 0
      or length(trim(coalesce(p_area, ''))) < 2
      or length(trim(coalesce(p_area, ''))) > 80
      or length(coalesce(p_notes, '')) > 300 then
    raise exception 'Order contact and delivery details are invalid.';
  end if;
  if p_items is null
      or jsonb_typeof(p_items) <> 'array'
      or jsonb_array_length(p_items) = 0 then
    raise exception 'At least one order item is required.';
  end if;

  insert into public.orders (owner_id, name, phone, area, notes)
  values (
    auth.uid(),
    trim(p_name),
    trim(p_phone),
    trim(p_area),
    coalesce(p_notes, '')
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_dish_id := (v_item ->> 'id')::bigint;
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity < 1 or v_quantity > 20 then
      raise exception 'Dish quantity must be between 1 and 20.';
    end if;

    select d.name, d.price::numeric(12, 2)
    into v_dish_name, v_price
    from public.dishes d
    where d.id = v_dish_id
      and d.is_available = true;

    if not found then
      raise exception 'Dish % is unavailable.', v_dish_id;
    end if;

    insert into public.order_items (
      order_id, dish_id, dish_name, unit_price, quantity, line_total
    )
    values (
      v_order_id,
      v_dish_id,
      v_dish_name,
      v_price,
      v_quantity,
      v_price * v_quantity
    );
    v_total := v_total + (v_price * v_quantity);
  end loop;

  update public.orders
  set total = v_total, updated_at = now()
  where id = v_order_id;

  return v_order_id;
end;
$$;

create or replace function public.cancel_order(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  update public.orders
  set status = 'cancelled', updated_at = now()
  where id = p_order_id
    and owner_id = auth.uid()
    and status in ('placed', 'preparing', 'out-for-delivery');

  return found;
end;
$$;

create or replace function public.advance_order_status(
  p_order_id uuid,
  p_next_status text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role text;
begin
  if auth.uid() is null then
    return false;
  end if;

  select p.role into v_role
  from public.profiles p
  where p.id = auth.uid();

  if v_role is distinct from 'staff' then
    return false;
  end if;

  update public.orders
  set status = p_next_status, updated_at = now()
  where id = p_order_id
    and (
      (status = 'placed' and p_next_status = 'preparing')
      or (status = 'preparing' and p_next_status = 'out-for-delivery')
      or (status = 'out-for-delivery' and p_next_status = 'delivered')
    );

  return found;
end;
$$;

revoke all on function public.place_order(text, text, text, text, jsonb) from public;
revoke all on function public.cancel_order(uuid) from public;
revoke all on function public.advance_order_status(uuid, text) from public;
grant execute on function public.place_order(text, text, text, text, jsonb) to authenticated;
grant execute on function public.cancel_order(uuid) to authenticated;
grant execute on function public.advance_order_status(uuid, text) to authenticated;
