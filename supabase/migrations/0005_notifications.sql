-- ============ notifications ============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('new_order', 'order_status_changed')),
  title text not null,
  body text not null,
  order_id uuid references public.orders(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- No insert policy for regular users — rows are only created by the
-- SECURITY DEFINER trigger functions below.

alter publication supabase_realtime add table public.notifications;

-- ============ notify all admins when a new order is placed ============
create or replace function public.notify_new_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, body, order_id)
  select
    id,
    'new_order',
    'Đơn hàng mới',
    'Đơn hàng #' || upper(substring(new.id::text, 1, 8)) || ' vừa được đặt — ' ||
      to_char(new.total, 'FM999G999G999G999') || '₫',
    new.id
  from public.profiles
  where role = 'admin';
  return new;
end;
$$;

create trigger on_order_created_notify
  after insert on public.orders
  for each row execute function public.notify_new_order();

-- ============ notify the customer when their order's status changes ============
create or replace function public.notify_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status_label text;
begin
  if new.status is distinct from old.status then
    v_status_label := case new.status
      when 'pending' then 'Chờ xác nhận'
      when 'confirmed' then 'Đã xác nhận'
      when 'shipped' then 'Đang giao'
      when 'completed' then 'Hoàn thành'
      when 'cancelled' then 'Đã hủy'
      else new.status
    end;

    insert into public.notifications (user_id, type, title, body, order_id)
    values (
      new.user_id,
      'order_status_changed',
      'Cập nhật đơn hàng',
      'Đơn hàng #' || upper(substring(new.id::text, 1, 8)) || ' đã chuyển sang "' || v_status_label || '"',
      new.id
    );
  end if;
  return new;
end;
$$;

create trigger on_order_status_updated_notify
  after update on public.orders
  for each row execute function public.notify_order_status_change();
