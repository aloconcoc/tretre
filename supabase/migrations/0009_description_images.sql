alter table public.products
  add column description_images text[] not null default '{}';
