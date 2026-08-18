-- ============ public "đã bán" count ============
-- Returns only an aggregate integer — never exposes who bought what, so
-- it's safe to call from the anon/public role despite orders/order_items
-- themselves being locked down to their own owner + admin via RLS.
create or replace function public.get_product_sold_count(p_product_id text)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(sum(oi.quantity), 0)::integer
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where oi.product_id = p_product_id and o.status != 'cancelled';
$$;

grant execute on function public.get_product_sold_count to anon, authenticated;

-- ============ public list of currently-usable vouchers ============
-- Deliberately returns only what's safe to advertise to a shopper (code,
-- type, value, minimum order, description) — never id/used_count/internal
-- timestamps — and only rows that are active, within their date window,
-- and not yet exhausted. The vouchers table itself still has no public
-- SELECT policy, so this function is the only public-facing way to browse
-- promo codes; it can't be used to enumerate inactive/expired/internal ones.
create or replace function public.list_active_vouchers()
returns table(code text, type text, value integer, min_order_value integer, description text)
language sql
security definer
set search_path = public
stable
as $$
  select code, type, value, min_order_value, description
  from public.vouchers
  where active = true
    and (valid_from is null or now() >= valid_from)
    and (valid_until is null or now() <= valid_until)
    and (max_uses = 0 or used_count < max_uses)
  order by
    case type when 'percentage' then value else 0 end desc,
    created_at desc;
$$;

grant execute on function public.list_active_vouchers to anon, authenticated;
