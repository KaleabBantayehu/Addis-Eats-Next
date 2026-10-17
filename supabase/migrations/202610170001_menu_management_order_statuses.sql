alter table public.dishes
  add column if not exists image_url text,
  add column if not exists is_available boolean not null default true,
  add column if not exists is_hidden boolean not null default false,
  add column if not exists finished_today boolean not null default false;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'dishes'
      and column_name = 'image'
  ) then
    execute '
      update public.dishes
      set image_url = image
      where image_url is null and image is not null
    ';
  end if;
end;
$$;

alter table public.orders
  drop constraint if exists orders_status_check;

update public.orders
set status = case status
  when 'placed' then 'pending'
  when 'out-for-delivery' then 'ready'
  else status
end;

alter table public.orders
  alter column status set default 'pending',
  add constraint orders_status_check
  check (status in ('pending', 'preparing', 'ready', 'delivered', 'cancelled'));

grant usage on schema public to anon, authenticated;
grant select on public.dishes to anon, authenticated;
revoke insert, update, delete on public.dishes from anon, authenticated;
grant insert on public.dishes to authenticated;
grant update (is_available, is_hidden, finished_today)
  on public.dishes to authenticated;

alter table public.dishes enable row level security;

do $$
declare
  dishes_id_sequence text;
begin
  dishes_id_sequence := pg_get_serial_sequence('public.dishes', 'id');
  if dishes_id_sequence is not null then
    execute format(
      'grant usage, select on sequence %s to authenticated',
      dishes_id_sequence
    );
  end if;
end;
$$;

drop policy if exists "Public and staff read dishes" on public.dishes;
create policy "Public and staff read dishes"
  on public.dishes for select
  to anon, authenticated
  using (
    not is_hidden
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('staff', 'admin')
    )
  );

drop policy if exists "Staff manage dishes" on public.dishes;
create policy "Staff manage dishes"
  on public.dishes for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('staff', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('staff', 'admin')
    )
  );

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
    and status in ('pending', 'preparing', 'ready');

  return found;
end;
$$;

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
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'Order items must be provided as an array.';
  end if;
  if jsonb_array_length(p_items) = 0 then
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
      and d.is_available = true
      and d.is_hidden = false
      and d.finished_today = false;

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

  if v_role is distinct from 'staff'
      and v_role is distinct from 'admin' then
    return false;
  end if;

  update public.orders
  set status = p_next_status, updated_at = now()
  where id = p_order_id
    and (
      (status = 'pending' and p_next_status = 'preparing')
      or (status = 'preparing' and p_next_status = 'ready')
      or (status = 'ready' and p_next_status = 'delivered')
      or (
        status in ('pending', 'preparing', 'ready')
        and p_next_status = 'cancelled'
      )
    );

  return found;
end;
$$;

revoke all on function public.cancel_order(uuid) from public;
revoke all on function public.place_order(text, text, text, text, jsonb) from public;
revoke all on function public.advance_order_status(uuid, text) from public;
grant execute on function public.cancel_order(uuid) to authenticated;
grant execute on function public.place_order(text, text, text, text, jsonb) to authenticated;
grant execute on function public.advance_order_status(uuid, text) to authenticated;
