# Hướng Dẫn Sử Dụng Tiembac.vn

## 1. Chạy project

```bash
npm install
npm run dev
```

Sau đó mở:

```txt
http://localhost:3000
```

Nếu port 3000 bận, Next.js sẽ tự chuyển sang port khác, ví dụ:

```txt
http://localhost:3001
```

## 2. Cách vào trang admin

Trang đăng nhập admin:

```txt
http://localhost:3000/admin/login
```

Hoặc vào thẳng:

```txt
http://localhost:3000/admin
```

Nếu chưa đăng nhập, hệ thống sẽ tự chuyển về `/admin/login`.

Tài khoản admin dev:

```txt
user: admin
pass: xinchaobro123
```

Dashboard admin:

```txt
http://localhost:3000/admin/dashboard
```

Các trang admin hiện có:

```txt
/admin/products
/admin/products/new
/admin/products/[id]
/admin/orders
/admin/orders/[id]
/admin/inventory
/admin/categories
/admin/collections
/admin/coupons
/admin/videos
/admin/reviews
/admin/blog
/admin/settings
```

Ví dụ:

```txt
http://localhost:3000/admin/products
http://localhost:3000/admin/orders
http://localhost:3000/admin/settings
```

## 3. Lưu ý về đăng nhập admin

Hiện tại admin đã có UI route và layout quản trị, nhưng phần chặn route bằng Supabase Auth chưa được bật hoàn chỉnh.

File env Supabase đang dùng:

```txt
.env.local
```

Các biến:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://mlbroienajaiacqzxcca.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_JaYXZwYWi8PgeJDHMweOjw_VEffR01_
```

Khi nối auth thật, admin sẽ dùng Supabase Auth tại `/admin/login`, sau đó mới cho truy cập các route `/admin/*`.

## 3.1. Tạo dữ liệu thật trong Supabase

Publishable key không đủ quyền tạo bảng hoặc xóa database. Để clear dữ liệu cũ và tạo dữ liệu thật:

1. Mở Supabase Dashboard.
2. Vào SQL Editor.
3. Chạy toàn bộ file:

```txt
supabase/schema.sql
```

4. Chạy tiếp toàn bộ file:

```txt
supabase/seed.sql
```

Sau khi seed xong, website sẽ ưu tiên đọc dữ liệu từ Supabase. Mock data chỉ còn dùng làm fallback khi Supabase chưa có bảng hoặc chưa có dữ liệu.

## 4. Storefront chính

Các trang khách hàng:

```txt
/
/collections
/collections/nhan-bac
/products/nhan-bac-s925-moonlight
/checkout
/order-success
/track-order
/journal
/policy/huong-dan-chon-size
```

Cart dùng drawer ở icon giỏ hàng trên header. Khách mua hàng không cần đăng nhập.
