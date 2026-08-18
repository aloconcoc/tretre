-- ============ seller chat: one conversation thread per customer ============
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

create policy "conversations_select_own_or_admin" on public.conversations
  for select using (auth.uid() = customer_id or public.is_admin());
create policy "conversations_insert_own" on public.conversations
  for insert with check (auth.uid() = customer_id);

alter publication supabase_realtime add table public.conversations;

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('customer', 'admin')),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index chat_messages_conversation_id_idx on public.chat_messages(conversation_id, created_at);

alter table public.chat_messages enable row level security;

create policy "chat_messages_select" on public.chat_messages
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.customer_id = auth.uid()
    )
  );
create policy "chat_messages_insert" on public.chat_messages
  for insert with check (
    sender_id = auth.uid()
    and (
      public.is_admin()
      or exists (
        select 1 from public.conversations c
        where c.id = conversation_id and c.customer_id = auth.uid()
      )
    )
  );
create policy "chat_messages_update_read" on public.chat_messages
  for update using (
    public.is_admin()
    or exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.customer_id = auth.uid()
    )
  );

alter publication supabase_realtime add table public.chat_messages;

create or replace function public.touch_conversation_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;

create trigger chat_messages_touch_conversation
  after insert on public.chat_messages
  for each row execute function public.touch_conversation_updated_at();

-- ============ notifications: extend to cover new chat messages ============
-- Find whatever the "type in (...)" check constraint is actually named
-- (Postgres' default-naming guess could be wrong) and drop it before adding
-- the widened version, rather than hardcoding a constraint name.
do $$
declare
  con_name text;
begin
  select con.conname into con_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'notifications' and con.contype = 'c' and pg_get_constraintdef(con.oid) ilike '%type = any%';

  if con_name is not null then
    execute format('alter table public.notifications drop constraint %I', con_name);
  end if;
end $$;

alter table public.notifications add constraint notifications_type_check
  check (type in ('new_order', 'order_status_changed', 'new_message'));

alter table public.notifications add column conversation_id uuid references public.conversations(id) on delete cascade;

create or replace function public.notify_new_chat_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_preview text;
begin
  select customer_id into v_customer_id from public.conversations where id = new.conversation_id;
  v_preview := left(new.body, 80);

  if new.sender_role = 'customer' then
    insert into public.notifications (user_id, type, title, body, conversation_id)
    select id, 'new_message', 'Tin nhắn mới', v_preview, new.conversation_id
    from public.profiles
    where role = 'admin';
  else
    insert into public.notifications (user_id, type, title, body, conversation_id)
    values (v_customer_id, 'new_message', 'Tin nhắn từ TRETRE', v_preview, new.conversation_id);
  end if;

  return new;
end;
$$;

create trigger on_chat_message_created_notify
  after insert on public.chat_messages
  for each row execute function public.notify_new_chat_message();
