-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- admin-role check as a SECURITY DEFINER function so policies on
-- products/orders/order_items can call it without RLS recursion issues.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_select_admin_all" on public.profiles
  for select using (public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id and role = 'customer');
  -- users can edit their own name but cannot self-promote to admin via this policy

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ products ============
create table public.products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  name_en text,
  collection text not null default '',
  category text not null default '' check (category in ('', 'bags','accessories','home-decor')),
  price integer not null check (price >= 0),
  price_usd numeric(10,2) not null default 0,
  images text[] not null default '{}',
  description text,
  description_en text,
  long_description text,
  material text,
  specifications jsonb not null default '{}'::jsonb,
  bestseller boolean not null default false,
  premium boolean not null default false,
  in_stock boolean not null default true,
  quantity integer not null default 0 check (quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products(category);
create index products_collection_idx on public.products(collection);

alter table public.products enable row level security;

create policy "products_public_read" on public.products
  for select using (true);
create policy "products_admin_insert" on public.products
  for insert with check (public.is_admin());
create policy "products_admin_update" on public.products
  for update using (public.is_admin());
create policy "products_admin_delete" on public.products
  for delete using (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ============ orders / order_items ============
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending','confirmed','shipped','completed','cancelled')),
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  district text not null,
  ward text not null,
  payment_method text not null check (payment_method in ('cod','bank-transfer')),
  notes text,
  subtotal integer not null default 0,
  shipping_fee integer not null default 0,
  total integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders(user_id);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  product_name text not null,
  product_image text,
  unit_price integer not null,
  quantity integer not null check (quantity > 0),
  line_total integer not null
);

create index order_items_order_id_idx on public.order_items(order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);
create policy "orders_select_admin" on public.orders
  for select using (public.is_admin());
create policy "orders_update_admin" on public.orders
  for update using (public.is_admin());
-- no direct insert policy for orders/order_items: creation only happens
-- via the SECURITY DEFINER create_order() function below.

create policy "order_items_select_own" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "order_items_select_admin" on public.order_items
  for select using (public.is_admin());

create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- ============ atomic checkout RPC ============
create or replace function public.create_order(
  p_items jsonb, -- [{product_id, quantity}, ...]
  p_full_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_city text,
  p_district text,
  p_ward text,
  p_payment_method text,
  p_notes text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product record;
  v_subtotal integer := 0;
  v_qty integer;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  insert into public.orders (
    user_id, status, full_name, email, phone, address, city, district, ward,
    payment_method, notes, subtotal, shipping_fee, total
  ) values (
    auth.uid(), 'pending', p_full_name, p_email, p_phone, p_address, p_city, p_district, p_ward,
    p_payment_method, p_notes, 0, 0, 0
  ) returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;
    if v_qty is null or v_qty <= 0 then
      raise exception 'Invalid quantity for product %', v_item->>'product_id';
    end if;

    select id, name, price, images, quantity, in_stock
      into v_product
      from public.products
      where id = (v_item->>'product_id')
      for update; -- row lock: prevents two simultaneous checkouts from overselling

    if v_product.id is null then
      raise exception 'Product % not found', v_item->>'product_id';
    end if;

    if not v_product.in_stock or v_product.quantity < v_qty then
      raise exception 'Insufficient stock for %', v_product.name;
    end if;

    insert into public.order_items (
      order_id, product_id, product_name, product_image, unit_price, quantity, line_total
    ) values (
      v_order_id, v_product.id, v_product.name,
      (case when array_length(v_product.images,1) > 0 then v_product.images[1] else null end),
      v_product.price, v_qty, v_product.price * v_qty
    );

    v_subtotal := v_subtotal + (v_product.price * v_qty);

    update public.products
      set quantity = quantity - v_qty,
          in_stock = (quantity - v_qty) > 0
      where id = v_product.id;
  end loop;

  update public.orders
    set subtotal = v_subtotal, total = v_subtotal
    where id = v_order_id;

  return v_order_id;
end;
$$;

grant execute on function public.create_order to authenticated;
