-- ============ categories (was a hardcoded 3-value enum on products.category) ============
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories_public_read" on public.categories
  for select using (true);
create policy "categories_admin_insert" on public.categories
  for insert with check (public.is_admin());
create policy "categories_admin_update" on public.categories
  for update using (public.is_admin());
create policy "categories_admin_delete" on public.categories
  for delete using (public.is_admin());

insert into public.categories (slug, name) values
  ('bags', 'Túi xách'),
  ('accessories', 'Phụ kiện'),
  ('home-decor', 'Trang trí nhà');

-- ============ products.category: drop the hardcoded check, add a real FK ============
update public.products set category = null where category = '';

alter table public.products drop constraint if exists products_category_check;
alter table public.products alter column category drop default;
alter table public.products alter column category drop not null;

alter table public.products
  add constraint products_category_fkey
  foreign key (category) references public.categories(slug)
  on update cascade on delete set null;
