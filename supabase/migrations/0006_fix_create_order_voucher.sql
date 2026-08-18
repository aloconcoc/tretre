-- Fix: "record \"v_voucher\" is not assigned yet" when checking out without
-- a voucher code. The old version declared v_voucher as `record` and only
-- assigned it inside the voucher branch — referencing v_voucher.id/.code
-- later unconditionally fails when that branch never ran. Replaced with
-- plain scalar variables, which default safely to NULL when unused.
-- Same signature as the 0003 version, so a plain replace is enough.
create or replace function public.create_order(
  p_items jsonb,
  p_full_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_city text,
  p_district text,
  p_ward text,
  p_payment_method text,
  p_notes text,
  p_voucher_code text default null,
  p_payment_proof_url text default null
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
  v_discount integer := 0;
  v_qty integer;
  v_voucher_id uuid;
  v_voucher_code text;
  v_voucher_type text;
  v_voucher_value integer;
  v_voucher_min_order_value integer;
  v_voucher_max_uses integer;
  v_voucher_used_count integer;
  v_voucher_valid_from timestamptz;
  v_voucher_valid_until timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  insert into public.orders (
    user_id, status, full_name, email, phone, address, city, district, ward,
    payment_method, notes, subtotal, shipping_fee, discount, total, payment_proof_url
  ) values (
    auth.uid(), 'pending', p_full_name, p_email, p_phone, p_address, p_city, p_district, p_ward,
    p_payment_method, p_notes, 0, 0, 0, 0, p_payment_proof_url
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
      for update;

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

  if p_voucher_code is not null and length(trim(p_voucher_code)) > 0 then
    select id, code, type, value, min_order_value, max_uses, used_count, valid_from, valid_until
      into v_voucher_id, v_voucher_code, v_voucher_type, v_voucher_value,
           v_voucher_min_order_value, v_voucher_max_uses, v_voucher_used_count,
           v_voucher_valid_from, v_voucher_valid_until
      from public.vouchers
      where code = upper(p_voucher_code) and active = true
      for update; -- row lock: prevents concurrent checkouts from exceeding max_uses

    if v_voucher_id is null then
      raise exception 'Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa';
    end if;
    if v_voucher_valid_from is not null and now() < v_voucher_valid_from then
      raise exception 'Mã giảm giá chưa có hiệu lực';
    end if;
    if v_voucher_valid_until is not null and now() > v_voucher_valid_until then
      raise exception 'Mã giảm giá đã hết hạn';
    end if;
    if v_voucher_max_uses > 0 and v_voucher_used_count >= v_voucher_max_uses then
      raise exception 'Mã giảm giá đã hết lượt sử dụng';
    end if;
    if v_subtotal < v_voucher_min_order_value then
      raise exception 'Đơn hàng chưa đạt giá trị tối thiểu để dùng mã này';
    end if;

    v_discount := case v_voucher_type
      when 'percentage' then least(floor(v_subtotal * v_voucher_value / 100.0)::integer, v_subtotal)
      when 'fixed' then least(v_voucher_value, v_subtotal)
      else 0
    end;

    update public.vouchers set used_count = used_count + 1 where id = v_voucher_id;
  end if;

  update public.orders
    set subtotal = v_subtotal,
        discount = v_discount,
        voucher_code = v_voucher_code,
        total = v_subtotal - v_discount
    where id = v_order_id;

  return v_order_id;
end;
$$;

grant execute on function public.create_order(jsonb, text, text, text, text, text, text, text, text, text, text, text) to authenticated;
