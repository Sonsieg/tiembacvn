-- Non-destructive patch for phase 1 production order handling.
-- Run this once in Supabase SQL editor if your database was created before
-- idempotent atomic checkout existed.

alter table orders add column if not exists idempotency_key text unique;

create or replace function create_checkout_order_atomic(p_order jsonb)
returns text
language plpgsql
security definer
as $$
declare
  v_existing_order_number text;
  v_customer_id uuid;
  v_order_id uuid;
  v_item jsonb;
  v_order_number text := p_order->>'orderNumber';
  v_idempotency_key text := nullif(p_order->>'idempotencyKey', '');
begin
  if v_idempotency_key is not null then
    select order_number into v_existing_order_number
    from orders
    where idempotency_key = v_idempotency_key;

    if v_existing_order_number is not null then
      return v_existing_order_number;
    end if;
  end if;

  insert into customers(full_name, phone, email)
  values (
    p_order #>> '{customer,fullName}',
    p_order #>> '{customer,phone}',
    p_order #>> '{customer,email}'
  )
  returning id into v_customer_id;

  insert into orders(
    order_number,
    idempotency_key,
    customer_id,
    customer_name,
    customer_phone,
    customer_email,
    subtotal,
    discount_total,
    shipping_fee,
    grand_total,
    coupon_code,
    payment_method,
    payment_status,
    order_status,
    fulfillment_status
  )
  values (
    v_order_number,
    v_idempotency_key,
    v_customer_id,
    p_order #>> '{customer,fullName}',
    p_order #>> '{customer,phone}',
    p_order #>> '{customer,email}',
    (p_order->>'subtotal')::int,
    (p_order->>'discountTotal')::int,
    (p_order->>'shippingFee')::int,
    (p_order->>'grandTotal')::int,
    nullif(p_order->>'couponCode', ''),
    p_order->>'paymentMethod',
    p_order->>'paymentStatus',
    p_order->>'orderStatus',
    p_order->>'fulfillmentStatus'
  )
  returning id into v_order_id;

  insert into order_addresses(order_id, address_line, ward, district, province, note)
  values (
    v_order_id,
    p_order #>> '{address,addressLine}',
    p_order #>> '{address,ward}',
    p_order #>> '{address,district}',
    p_order #>> '{address,province}',
    nullif(p_order #>> '{address,note}', '')
  );

  for v_item in select * from jsonb_array_elements(p_order->'items')
  loop
    perform reserve_stock((v_item->>'variantId')::uuid, (v_item->>'quantity')::int);

    insert into order_items(
      order_id,
      product_id,
      variant_id,
      product_title,
      variant_title,
      sku,
      image,
      unit_price,
      quantity,
      total_price
    )
    values (
      v_order_id,
      (v_item->>'productId')::uuid,
      (v_item->>'variantId')::uuid,
      v_item->>'title',
      v_item->>'variantTitle',
      v_item->>'sku',
      v_item->>'image',
      (v_item->>'unitPrice')::int,
      (v_item->>'quantity')::int,
      (v_item->>'totalPrice')::int
    );
  end loop;

  insert into order_status_history(order_id, status, note)
  values (v_order_id, p_order->>'orderStatus', 'Đã đặt hàng');

  insert into payments(order_id, provider, amount, status)
  values (
    v_order_id,
    case when p_order->>'paymentMethod' = 'cod' then 'cod' else 'manual' end,
    (p_order->>'grandTotal')::int,
    p_order->>'paymentStatus'
  );

  return v_order_number;
end;
$$;
