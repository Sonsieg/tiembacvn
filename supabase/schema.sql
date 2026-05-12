create extension if not exists pgcrypto;

drop table if exists settings cascade;
drop table if exists blog_posts cascade;
drop table if exists reviews cascade;
drop table if exists product_videos cascade;
drop table if exists customers cascade;
drop table if exists coupon_redemptions cascade;
drop table if exists coupons cascade;
drop table if exists shipments cascade;
drop table if exists shipping_methods cascade;
drop table if exists payments cascade;
drop table if exists order_status_history cascade;
drop table if exists order_addresses cascade;
drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists cart_items cascade;
drop table if exists carts cascade;
drop table if exists inventory_movements cascade;
drop table if exists inventory_items cascade;
drop table if exists product_collections cascade;
drop table if exists collections cascade;
drop table if exists product_categories cascade;
drop table if exists categories cascade;
drop table if exists product_images cascade;
drop table if exists product_variants cascade;
drop table if exists products cascade;

create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text not null,
  description text not null,
  care_guide text,
  material text not null default 'Bạc S925',
  weight text,
  stone text,
  plating text,
  warranty_months int not null default 6,
  gift_wrap boolean not null default true,
  rating numeric(2,1) not null default 5,
  review_count int not null default 0,
  featured boolean not null default false,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  tags text[] not null default '{}',
  status text not null default 'active' check (status in ('active','draft','archived')),
  seo_title text,
  seo_description text,
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  title text not null,
  sku text unique not null,
  size text,
  color text,
  price int not null check (price >= 0),
  compare_at_price int,
  cost_price int,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image text,
  active boolean not null default true
);

create table product_categories (
  product_id uuid references products(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image text,
  featured boolean not null default false,
  active boolean not null default true
);

create table product_collections (
  product_id uuid references products(id) on delete cascade,
  collection_id uuid references collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

create table inventory_items (
  variant_id uuid primary key references product_variants(id) on delete cascade,
  quantity_available int not null default 0,
  quantity_reserved int not null default 0,
  quantity_sold int not null default 0,
  low_stock_threshold int not null default 4,
  updated_at timestamptz not null default now()
);

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references product_variants(id) on delete set null,
  type text not null check (type in ('adjustment','reserve','release','sale','return')),
  quantity int not null,
  note text,
  created_at timestamptz not null default now()
);

create table carts (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  coupon_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  variant_id uuid not null references product_variants(id) on delete cascade,
  quantity int not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  subtotal int not null,
  discount_total int not null default 0,
  shipping_fee int not null default 0,
  grand_total int not null,
  coupon_code text,
  payment_method text not null check (payment_method in ('cod','bank_transfer','online')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  order_status text not null default 'pending' check (order_status in ('pending','confirmed','processing','shipped','completed','cancelled')),
  fulfillment_status text not null default 'unfulfilled' check (fulfillment_status in ('unfulfilled','packed','shipped','delivered','returned')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_title text not null,
  variant_title text not null,
  sku text not null,
  image text,
  unit_price int not null,
  quantity int not null,
  total_price int not null
);

create table order_addresses (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique not null references orders(id) on delete cascade,
  address_line text not null,
  ward text not null,
  district text not null,
  province text not null,
  note text
);

create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null default 'manual',
  amount int not null,
  status text not null default 'pending',
  transaction_id text,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table shipping_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  fee int not null default 0,
  free_threshold int,
  active boolean not null default true
);

create table shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  carrier text,
  tracking_number text,
  status text not null default 'pending',
  shipped_at timestamptz,
  delivered_at timestamptz
);

create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null check (type in ('percentage','fixed_amount','free_shipping')),
  value int not null default 0,
  min_order_total int not null default 0,
  usage_limit int not null default 0,
  used int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true
);

create table coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references coupons(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  redeemed_at timestamptz not null default now()
);

create table product_videos (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  youtube_url text not null,
  youtube_id text not null,
  title text not null,
  thumbnail_url text,
  type text not null,
  sort_order int not null default 0,
  featured boolean not null default false,
  status text not null default 'active' check (status in ('active','hidden','archived'))
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  customer_name text not null,
  rating numeric(2,1) not null,
  comment text not null,
  image text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  cover_image text,
  content text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published')),
  seo_title text,
  seo_description text,
  published_at timestamptz
);

create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function reserve_stock(p_variant_id uuid, p_quantity int)
returns void
language plpgsql
security definer
as $$
begin
  update inventory_items
  set quantity_reserved = quantity_reserved + p_quantity,
      updated_at = now()
  where variant_id = p_variant_id
    and quantity_available - quantity_reserved >= p_quantity;

  if not found then
    raise exception 'Insufficient stock for variant %', p_variant_id;
  end if;

  insert into inventory_movements(variant_id, type, quantity, note)
  values (p_variant_id, 'reserve', p_quantity, 'Reserved during checkout');
end;
$$;

alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table categories enable row level security;
alter table product_categories enable row level security;
alter table collections enable row level security;
alter table product_collections enable row level security;
alter table inventory_items enable row level security;
alter table product_videos enable row level security;
alter table reviews enable row level security;
alter table blog_posts enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_addresses enable row level security;
alter table payments enable row level security;
alter table coupons enable row level security;
alter table settings enable row level security;

create policy "Public read active products" on products for select using (status = 'active');
create policy "Public read active variants" on product_variants for select using (active = true);
create policy "Public read product images" on product_images for select using (true);
create policy "Public read active categories" on categories for select using (active = true);
create policy "Public read product categories" on product_categories for select using (true);
create policy "Public read active collections" on collections for select using (active = true);
create policy "Public read product collections" on product_collections for select using (true);
create policy "Public read inventory" on inventory_items for select using (true);
create policy "Public read active videos" on product_videos for select using (status = 'active');
create policy "Public read approved reviews" on reviews for select using (approved = true);
create policy "Public read published blog" on blog_posts for select using (status = 'published');
create policy "Public read active coupons" on coupons for select using (active = true);

create policy "Admin full products" on products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full variants" on product_variants for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full images" on product_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full collections" on collections for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full inventory" on inventory_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full videos" on product_videos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full reviews" on reviews for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full blog" on blog_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full orders" on orders for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
