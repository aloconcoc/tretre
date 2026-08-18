-- ============ product reviews ============
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  verified_purchase boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index reviews_product_id_idx on public.reviews(product_id);

alter table public.reviews enable row level security;

create policy "reviews_public_read" on public.reviews
  for select using (true);
create policy "reviews_insert_own" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "reviews_update_own" on public.reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews_delete_own" on public.reviews
  for delete using (auth.uid() = user_id);
create policy "reviews_delete_admin" on public.reviews
  for delete using (public.is_admin());

create trigger reviews_touch_updated_at
  before update on public.reviews
  for each row execute function public.touch_updated_at();

-- Server-controlled fields: the reviewer's display name and "verified
-- purchase" badge must never be trusted from client input, so they're
-- computed here on every insert instead of accepted as request body fields.
create or replace function public.set_review_author_and_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select coalesce(nullif(full_name, ''), split_part(email, '@', 1))
    into new.author_name
    from public.profiles
    where id = new.user_id;

  new.verified_purchase := exists (
    select 1
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where o.user_id = new.user_id and oi.product_id = new.product_id
  );

  return new;
end;
$$;

create trigger reviews_before_insert
  before insert on public.reviews
  for each row execute function public.set_review_author_and_verification();
