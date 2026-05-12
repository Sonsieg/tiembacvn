# README — Dự án Ecommerce Trang Sức Bạc **Tiembac.vn**

## 1. Tổng quan dự án

**Tiembac.vn** là website ecommerce bán trang sức bạc cao cấp, sử dụng giao diện tiếng Việt toàn bộ website.

Dự án được xây dựng bằng:

- **Next.js 15 App Router**
- **TypeScript**
- **TailwindCSS**
- **Supabase Database**
- **Supabase Auth cho admin**
- **Supabase Storage cho ảnh sản phẩm**
- **Zustand cho state management**
- **Framer Motion cho animation**
- **Lucide React cho icons**
- **React Hook Form + Zod cho form validation**

Dự án **không dùng Medusa**. Thay vào đó, hệ thống tự xây dựng một **mini commerce core** vừa đủ cho website bán trang sức bạc.

---

## 2. Mục tiêu chính

Tạo một website ecommerce trang sức bạc hoàn chỉnh, có thể dùng để launch thật, bao gồm:

- Giao diện storefront sang trọng
- Trang chủ
- Trang danh mục sản phẩm
- Trang chi tiết sản phẩm
- Cart drawer
- Guest checkout
- Trang đặt hàng thành công
- Trang tra cứu đơn hàng
- Blog/Journal SEO
- Trang chính sách
- Admin dashboard
- Quản lý sản phẩm
- Quản lý biến thể sản phẩm
- Quản lý tồn kho
- Quản lý đơn hàng
- Quản lý coupon
- Quản lý video YouTube review sản phẩm
- Quản lý bài viết SEO
- Supabase schema SQL
- Mock data
- Services layer
- API routes/server actions mẫu
- SEO metadata cơ bản
- Responsive mobile-first

---

## 3. Brand & UI Style

Tên thương hiệu: **Tiembac.vn**

Ngành hàng: Trang sức bạc cao cấp.

Sản phẩm chính:

- Nhẫn bạc
- Dây chuyền bạc
- Vòng tay bạc
- Bông tai bạc
- Charm bạc
- Trang sức quà tặng

Phong cách giao diện:

- Sang trọng
- Thanh lịch
- Cao cấp
- Hiện đại
- Gọn gàng
- Nữ tính nhẹ
- Có cảm giác thương hiệu trang sức thật có thể launch

Tone màu:

- **Deep Claret**: màu chủ đạo cho hero, button, footer, premium section
- **Metallic Silver**: màu trang sức, line, border, icon
- **Pearl White**: nền chính, card sản phẩm
- **Soft Gray**: text phụ, border, background phụ
- **Sky Blue**: accent nhẹ cho hover, focus, badge
- **White Star / Sparkle**: motif ngôi sao nhỏ tạo cảm giác trang sức lấp lánh

Giao diện nên có:

- Bo góc lớn
- Card sang trọng
- Glassmorphism nhẹ
- Metallic gradient
- Soft shadow
- Hover glow nhẹ
- Animation mượt
- Product image nổi bật
- CTA rõ ràng
- Nhiều khoảng trắng
- Mobile-first responsive

Không dùng style hoạt hình, không rẻ tiền, không quá nhiều màu, không marketplace layout.

---

## 4. Business Rules quan trọng

1. Khách hàng **không bắt buộc đăng nhập** để mua hàng.
2. Guest checkout là mặc định.
3. Cart lưu bằng `localStorage` hoặc cookie thông qua Zustand.
4. Admin đăng nhập bằng Supabase Auth.
5. Frontend không được tin total từ client khi checkout.
6. Khi checkout, server phải tự tính lại:
   - subtotal
   - discount
   - shipping fee
   - grand total
7. Order item phải lưu snapshot:
   - product title
   - variant title
   - SKU
   - image
   - unit price
   - quantity
   - total price
8. Inventory phải có reserve stock.
9. Nếu order bị hủy, phải release reserved stock.
10. Payment status chỉ update qua server/API/webhook giả lập.
11. Product video YouTube được config trong admin.
12. Product detail chỉ load video active theo `product_id`.
13. SEO phải có sẵn từ đầu bằng Next.js Metadata API.
14. Toàn bộ text UI phải là tiếng Việt.

---

## 5. Folder Structure đề xuất

```txt
/app
  /(storefront)
    /page.tsx
    /collections/page.tsx
    /collections/[slug]/page.tsx
    /products/[slug]/page.tsx
    /cart/page.tsx
    /checkout/page.tsx
    /order-success/page.tsx
    /track-order/page.tsx
    /journal/page.tsx
    /journal/[slug]/page.tsx
    /policy/[slug]/page.tsx

  /(admin)
    /admin/login/page.tsx
    /admin/dashboard/page.tsx
    /admin/products/page.tsx
    /admin/products/new/page.tsx
    /admin/products/[id]/page.tsx
    /admin/orders/page.tsx
    /admin/orders/[id]/page.tsx
    /admin/inventory/page.tsx
    /admin/categories/page.tsx
    /admin/collections/page.tsx
    /admin/coupons/page.tsx
    /admin/videos/page.tsx
    /admin/reviews/page.tsx
    /admin/blog/page.tsx
    /admin/settings/page.tsx

  /api
    /checkout/route.ts
    /orders/route.ts
    /track-order/route.ts
    /payment/webhook/route.ts
    /admin/upload/route.ts

/components
  /layout
  /ui
  /sections
  /product
  /cart
  /checkout
  /admin
  /video
  /seo

/features
  /products
  /cart
  /checkout
  /orders
  /inventory
  /admin
  /videos
  /seo

/store
  cart.store.ts
  favorite.store.ts
  filter.store.ts
  admin.store.ts

/hooks

/lib
  /supabase
  /services
  /validations
  /seo
  /utils
  /constants

/types

/data
  mock-products.ts
  mock-categories.ts
  mock-reviews.ts
  mock-videos.ts
  mock-blog.ts

/styles

/supabase
  schema.sql
  seed.sql
```

---

## 6. Supabase Schema cần tạo

Tạo file:

```txt
/supabase/schema.sql
```

Các bảng chính cần có:

- `products`
- `product_variants`
- `product_images`
- `categories`
- `product_categories`
- `collections`
- `product_collections`
- `inventory_items`
- `inventory_movements`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `order_addresses`
- `order_status_history`
- `payments`
- `shipping_methods`
- `shipments`
- `coupons`
- `coupon_redemptions`
- `customers`
- `product_videos`
- `reviews`
- `blog_posts`
- `settings`

### Ghi chú quan trọng về security

Cần bật RLS cho Supabase.

Policy cơ bản:

- Public read cho:
  - products active
  - categories active
  - collections active
  - reviews approved
  - product_videos active
  - blog published
- Admin full access nếu user authenticated và có role admin.
- Checkout/order creation thông qua server route.
- Không cho client update trực tiếp:
  - order
  - payment
  - inventory

---

## 7. Storefront Pages

### 7.1 Trang chủ `/`

Homepage luxury fullscreen.

#### Header

Sticky glass navbar:

- Logo Tiembac.vn hoặc monogram TB
- Trang chủ
- Bộ sưu tập
- Nhẫn
- Dây chuyền
- Vòng tay
- Bông tai
- Quà tặng
- Journal
- Tra cứu đơn
- Search icon
- Wishlist icon
- Cart icon

Không đặt login làm CTA chính.

Mobile:

- Animated sidebar menu
- Bottom navigation gồm:
  - Trang chủ
  - Tìm kiếm
  - Yêu thích
  - Giỏ hàng
  - Tra cứu

#### Hero fullscreen

Headline:

```txt
Tiembac.vn — Vẻ đẹp tinh tế từ bạc
```

Subtext:

```txt
Trang sức bạc S925 thanh lịch, hiện đại và được chọn lọc cho từng khoảnh khắc.
```

CTA:

- Mua ngay
- Khám phá bộ sưu tập

Visual:

- Deep claret gradient
- Ảnh trang sức bạc lớn
- Sparkle trắng
- Sky blue light reflection nhẹ
- Floating jewelry cards animation

Trust badges:

- Bạc S925
- Gói quà tinh tế
- Đổi size dễ dàng
- Mua hàng không cần đăng nhập

#### Các section trên homepage

- Featured categories
- New arrivals
- Best sellers
- Signature Collection
- Gift Collection
- Video Review Section
- Brand Story
- Testimonials
- Journal SEO
- Footer

---

### 7.2 Trang danh mục / collection

Routes:

```txt
/collections
/collections/[slug]
```

Features:

- Grid responsive
- Search realtime
- Filter desktop sidebar
- Filter drawer mobile
- Sort dropdown

Filter:

- Loại sản phẩm
- Khoảng giá
- Chất liệu
- Size
- Phong cách
- Dịp tặng
- Còn hàng
- Sản phẩm mới
- Bán chạy

Sort:

- Mới nhất
- Giá thấp đến cao
- Giá cao đến thấp
- Bán chạy
- Đánh giá cao

Có loading skeleton, empty state, error state.

---

### 7.3 Product Card

Component reusable.

Hiển thị:

- Ảnh sản phẩm
- Tên sản phẩm
- Label “Bạc S925”
- Rating
- Giá
- Giá gốc nếu sale
- Hint size
- Badge tồn kho:
  - Còn hàng
  - Chỉ còn 3 sản phẩm
  - Hết hàng
- Favorite button
- Add to cart button

Hover:

- Scale nhẹ
- Glow nhẹ sky blue
- Shadow claret

---

### 7.4 Product Detail Page

Route:

```txt
/products/[slug]
```

Layout:

- Gallery ảnh lớn bên trái
- Thumbnail gallery
- Product info bên phải
- Sticky product info trên desktop nếu hợp lý

Thông tin:

- Tên sản phẩm
- Rating
- Giá
- Compare-at price
- Chất liệu: Bạc S925
- Trọng lượng
- Loại đá
- Xi mạ
- Bảo hành
- Gói quà
- Chọn size
- Chọn số lượng
- Trạng thái tồn kho
- Add to Cart
- Mua ngay
- Favorite
- Link hướng dẫn chọn size

Accordion:

- Mô tả sản phẩm
- Hướng dẫn bảo quản
- Chính sách bảo hành
- Giao hàng & đổi trả

Badge:

- Mua hàng không cần đăng nhập
- Đóng gói quà tặng
- Đổi size dễ dàng
- Thanh toán an toàn

#### Product Video Review

Section:

```txt
Xem sản phẩm thực tế
```

Data từ `product_videos` theo `product_id`.

Video card:

- YouTube thumbnail
- Play icon
- Title
- Badge:
  - Review
  - Đeo thử
  - Mở hộp
  - Hướng dẫn chọn size
- Button:
  - Xem video
  - Mở trên YouTube

Click thumbnail mở modal video.

Không gọi YouTube search realtime ở frontend.

#### Related Products

Sản phẩm liên quan cùng category.

---

### 7.5 Cart Drawer

Cart drawer slide từ phải.

Có:

- Danh sách item
- Image
- Name
- Variant/size
- Price snapshot
- Quantity update
- Remove item
- Coupon input
- Subtotal
- Delivery fee estimate
- Total
- Checkout button
- Empty state

Cart dùng Zustand + localStorage.

Toast khi thêm vào giỏ:

```txt
Đã thêm vào giỏ hàng
```

---

### 7.6 Checkout Page

Route:

```txt
/checkout
```

Guest checkout.

Sections:

#### Thông tin liên hệ

- Họ và tên
- Số điện thoại
- Email

#### Địa chỉ nhận hàng

- Địa chỉ
- Phường/xã
- Quận/huyện
- Tỉnh/thành phố
- Ghi chú đơn hàng

#### Phương thức giao hàng

- Giao hàng tiêu chuẩn
- Miễn phí nếu đạt ngưỡng

#### Phương thức thanh toán

- COD
- Chuyển khoản ngân hàng
- Thanh toán online placeholder

#### Mã giảm giá

- Input coupon
- Apply button

#### Tóm tắt đơn hàng

- Items
- Subtotal
- Discount
- Shipping
- Total

Button:

```txt
Đặt hàng
```

Rules:

- Validate bằng Zod
- Server route `/api/checkout` tự tính lại giá
- Validate coupon
- Check inventory
- Reserve stock
- Create order
- Create order item snapshots
- Redirect sang `/order-success?order=...`

---

### 7.7 Order Success

Route:

```txt
/order-success
```

Hiển thị:

- Cảm ơn khách hàng
- Mã đơn hàng
- Tổng tiền
- Trạng thái thanh toán
- Thông tin giao hàng
- CTA:
  - Tra cứu đơn hàng
  - Tiếp tục mua sắm

---

### 7.8 Track Order

Route:

```txt
/track-order
```

Guest tra cứu bằng:

- Mã đơn hàng
- Email hoặc số điện thoại

Hiển thị:

- Timeline trạng thái đơn
- Payment status
- Fulfillment status
- Sản phẩm đã mua
- Địa chỉ giao hàng
- Tracking number nếu có

---

### 7.9 Journal / Blog

Routes:

```txt
/journal
/journal/[slug]
```

Blog SEO tiếng Việt.

Bài mẫu:

- Cách chọn size nhẫn bạc chuẩn tại nhà
- Cách bảo quản bạc S925 luôn sáng đẹp
- Bạc S925 là gì?
- Trang sức bạc có bị đen không?
- Gợi ý quà tặng trang sức bạc cho bạn gái

Article page có:

- Metadata
- Article schema
- Related products
- CTA mua hàng

---

### 7.10 Policy Pages

Route:

```txt
/policy/[slug]
```

Tạo các trang mẫu:

- Chính sách vận chuyển
- Chính sách đổi trả
- Chính sách bảo hành
- Hướng dẫn chọn size
- Chính sách bảo mật
- Điều khoản sử dụng

---

## 8. Admin Dashboard

Admin route:

```txt
/admin/login
/admin/dashboard
```

Admin dùng Supabase Auth.

Nếu chưa login thì redirect về `/admin/login`.

### 8.1 Admin Login

Form:

- Email
- Password
- Login button

UI luxury dark/claret, clean.

---

### 8.2 Admin Dashboard

Hiển thị:

- Tổng doanh thu
- Đơn hôm nay
- Đơn đang chờ
- Đơn đã thanh toán
- Sản phẩm sắp hết hàng
- Sản phẩm bán chạy
- Recent orders table
- Sales chart mock
- Payment status summary
- Inventory alerts

Sidebar:

- Tổng quan
- Sản phẩm
- Đơn hàng
- Tồn kho
- Danh mục
- Bộ sưu tập
- Mã giảm giá
- Video sản phẩm
- Đánh giá
- Blog SEO
- Cài đặt

Style:

- Claret sidebar
- Pearl white cards
- Sky blue active state
- Silver accent
- Responsive admin layout

---

### 8.3 Admin Products

Routes:

```txt
/admin/products
/admin/products/new
/admin/products/[id]
```

Features:

- Product list table
- Search
- Filter status
- Filter category
- Create product
- Edit product
- Archive product
- Upload ảnh Supabase Storage
- Quản lý variants
- SEO fields

Product form:

- Tên sản phẩm
- Slug
- Mô tả ngắn
- Mô tả đầy đủ
- Danh mục
- Bộ sưu tập
- Chất liệu
- Trọng lượng
- Loại đá
- Xi mạ
- Số tháng bảo hành
- Hướng dẫn bảo quản
- Có gói quà không
- Ảnh sản phẩm
- Biến thể:
  - SKU
  - Size
  - Màu
  - Giá
  - Giá gốc
  - Giá vốn
  - Active
- SEO title
- SEO description
- OG image
- Featured
- Status

---

### 8.4 Admin Inventory

Route:

```txt
/admin/inventory
```

Features:

- Danh sách tồn kho theo variant
- Quantity available
- Quantity reserved
- Quantity sold
- Low stock threshold
- Adjust stock modal
- Inventory movement history
- Low stock alert

---

### 8.5 Admin Orders

Routes:

```txt
/admin/orders
/admin/orders/[id]
```

Order list:

- Mã đơn
- Khách hàng
- SĐT
- Email
- Tổng tiền
- Trạng thái đơn
- Trạng thái thanh toán
- Trạng thái giao hàng
- Ngày tạo

Order detail:

- Mã đơn
- Thông tin khách guest
- Địa chỉ giao hàng
- Items snapshot
- Payment method
- Payment status
- Fulfillment status
- Timeline
- Admin notes
- Update order status
- Update fulfillment status
- Add tracking number
- Cancel order
- Nếu cancel thì release reserved inventory

---

### 8.6 Admin Coupons

Route:

```txt
/admin/coupons
```

Fields:

- Code
- Type:
  - percentage
  - fixed_amount
  - free_shipping
- Value
- Min order total
- Usage limit
- Start date
- End date
- Active

---

### 8.7 Admin Product Videos

Route:

```txt
/admin/videos
```

Có thể quản lý video toàn cục hoặc theo product.

Fields:

- Product
- YouTube URL
- Auto parse YouTube video ID
- Video title
- Thumbnail URL auto từ YouTube ID
- Video type:
  - Review
  - Đeo thử
  - Mở hộp
  - Hướng dẫn chọn size
- Sort order
- Featured
- Status:
  - active
  - hidden
  - archived

Frontend chỉ hiển thị video active.

---

### 8.8 Admin Reviews

Route:

```txt
/admin/reviews
```

- Danh sách đánh giá
- Approve
- Hide
- Delete
- Rating
- Customer name
- Product
- Comment
- Optional image

---

### 8.9 Admin Blog SEO

Route:

```txt
/admin/blog
```

- Create/edit blog post
- Slug
- Cover image
- SEO title
- SEO description
- Draft/published
- Related products placeholder

---

### 8.10 Admin Settings

Route:

```txt
/admin/settings
```

Settings:

- Store name
- Logo
- Contact email
- Phone
- Address
- Social links
- Shipping fee
- Free shipping threshold
- Payment methods
- SEO default title
- SEO default description
- Maintenance mode

---

## 9. Services Layer

Không gọi Supabase trực tiếp lung tung trong component. Tạo services:

```txt
/lib/services/product.service.ts
/lib/services/cart.service.ts
/lib/services/order.service.ts
/lib/services/checkout.service.ts
/lib/services/inventory.service.ts
/lib/services/payment.service.ts
/lib/services/coupon.service.ts
/lib/services/video.service.ts
/lib/services/review.service.ts
/lib/services/blog.service.ts
/lib/services/admin.service.ts
```

Các service cần có function mẫu:

```ts
getProducts()
getProductBySlug(slug)
getProductsByCategory(slug)
getProductVideos(productId)
createCheckoutOrder(input)
reserveInventory(items)
releaseInventory(orderId)
validateCoupon(code, subtotal)
calculateOrderTotals(items, coupon, shippingMethod)
trackOrder(orderNumber, emailOrPhone)
```

---

## 10. API Routes / Server Actions

### POST `/api/checkout`

Input:

- cart items
- customer info
- address
- payment method
- coupon code
- note

Xử lý:

- Validate input bằng Zod
- Fetch product variants từ Supabase
- Tự tính lại price
- Validate coupon
- Calculate total
- Check stock
- Reserve stock
- Create order
- Create order items snapshot
- Create address
- Create payment pending
- Return order_number

---

### POST `/api/track-order`

Input:

- order_number
- email_or_phone

Return:

- order
- order items
- status timeline

---

### POST `/api/payment/webhook`

Mock webhook:

- Update payment status
- Add order status history

---

## 11. Zustand Stores

### `cart.store.ts`

State:

- items
- isOpen
- couponCode
- addItem
- removeItem
- updateQuantity
- clearCart
- openCart
- closeCart
- subtotal selector

Persist localStorage.

### `favorite.store.ts`

- favoriteProductIds
- toggleFavorite
- isFavorite

### `filter.store.ts`

- search
- category
- priceRange
- material
- size
- sort
- resetFilters

### `admin.store.ts`

- sidebar open/close
- admin UI state

---

## 12. Components cần tạo

### Layout

- StorefrontHeader
- MobileBottomNav
- Footer
- AdminSidebar
- AdminTopbar

### UI

- Button
- Input
- Textarea
- Select
- Badge
- Card
- Modal
- Drawer
- Skeleton
- Toast
- EmptyState
- ErrorState
- Price
- RatingStars

### Product

- ProductCard
- ProductGrid
- ProductGallery
- ProductInfo
- SizeSelector
- QuantitySelector
- RelatedProducts
- ProductVideoSection

### Cart

- CartDrawer
- CartItem
- CartSummary

### Checkout

- CheckoutForm
- ContactForm
- AddressForm
- PaymentMethod
- OrderSummary
- CouponBox

### Admin

- StatCard
- AdminTable
- ProductForm
- VariantEditor
- InventoryTable
- OrderStatusBadge
- OrderTimeline
- VideoForm
- CouponForm
- BlogEditor

---

## 13. Mock Data

Tạo mock data tiếng Việt.

Categories:

- Nhẫn bạc
- Dây chuyền
- Vòng tay
- Bông tai
- Charm bạc
- Quà tặng

Products:

- Nhẫn bạc S925 Moonlight
- Dây chuyền bạc Stellar Heart
- Vòng tay bạc Minimal Shine
- Bông tai bạc Pearl Drop
- Charm bạc Lucky Star
- Nhẫn bạc Claret Stone
- Dây chuyền bạc Aurora
- Vòng tay bạc Infinity
- Bông tai bạc Aurora Drop
- Lắc tay bạc Sweet Star

Product fields:

- material: Bạc S925
- weight: 2.8g, 3.2g, 4.5g
- warranty: 6-12 tháng
- sizes: 5, 6, 7, 8, 9
- price: giá VNĐ thực tế
- stock: realistic
- rating: 4.6–5.0

Reviews:

- “Đóng gói rất đẹp, phù hợp làm quà.”
- “Bạc sáng, đeo lên tay rất tinh tế.”
- “Shop tư vấn size rất chuẩn.”
- “Sản phẩm ngoài đời đẹp hơn ảnh.”
- “Giao hàng nhanh, hộp quà xinh.”

Videos:

- Mock YouTube URL
- Type Review / Đeo thử / Mở hộp

Blog posts:

- Cách chọn size nhẫn bạc chuẩn tại nhà
- Cách bảo quản bạc S925 luôn sáng đẹp
- Bạc S925 là gì?
- Trang sức bạc có bị đen không?
- Gợi ý quà tặng trang sức bạc cho bạn gái

---

## 14. SEO

Dùng Next.js Metadata API.

Cần tạo:

- Dynamic metadata cho product
- Dynamic metadata cho collection
- Dynamic metadata cho blog
- JSON-LD Product schema
- Breadcrumb schema
- Organization schema
- Website schema
- Article schema

Tạo route:

```txt
/app/sitemap.ts
/app/robots.ts
```

Product page cần:

- title
- description
- canonical
- OG image
- product JSON-LD
- breadcrumb JSON-LD

---

## 15. Animation

Dùng Framer Motion:

- Hero fade in
- Product cards stagger
- Category hover
- Cart drawer slide
- Mobile menu animation
- Video modal animation
- Checkout form transition
- Admin dashboard card fade
- Floating jewelry card animation
- Hover glow

---

## 16. Responsive

Phải responsive đầy đủ:

- Mobile
- Tablet
- Desktop

Mobile ưu tiên:

- Header gọn
- Bottom nav
- Product cards 2 cột
- Filter drawer
- Checkout single column
- Cart drawer full width
- Admin table có responsive scroll

---

## 17. Loading / Empty / Error States

Tạo đầy đủ:

- Product skeleton
- Product grid skeleton
- Cart empty
- Search empty
- Checkout error
- Order tracking not found
- Admin table empty
- Upload error
- Form validation error

---

## 18. Output mong muốn

Generate toàn bộ source code project.

Bao gồm:

- package.json
- next.config.ts
- tailwind.config.ts
- tsconfig.json
- .env.example
- app routes
- components
- services
- stores
- types
- mock data
- Supabase schema SQL
- Supabase seed SQL
- SEO utilities
- API routes
- Admin dashboard pages
- Storefront pages

Code phải clean, dễ mở rộng, có comment ở các phần nghiệp vụ quan trọng như:

- checkout
- inventory reserve
- order snapshot
- payment webhook

Không cần kết nối Supabase thật ngay. Nếu thiếu env thì fallback sang mock data để UI vẫn chạy được.

Khi config Supabase sau, chỉ cần thay env là có thể dùng.

Ưu tiên hoàn thiện giao diện đẹp và full flow trước, sau đó chuẩn hóa service layer để dễ thay mock bằng Supabase thật.

---

## 19. Yêu cầu cuối cùng

Tạo website **Tiembac.vn** hoàn chỉnh, tiếng Việt, luxury ecommerce, bán trang sức bạc, dùng Next.js + Supabase, guest checkout, cart drawer, admin dashboard, product management, order management, inventory reserve, product video YouTube config, SEO-ready, responsive, production-ready architecture.
