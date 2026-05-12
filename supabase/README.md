# Supabase Tiembac.vn

## Cách tạo real database

Publishable key chỉ dùng cho client/public access, không đủ quyền tạo bảng hoặc xóa dữ liệu.

Để reset database và seed dữ liệu thật:

1. Mở Supabase Dashboard.
2. Vào SQL Editor.
3. Chạy toàn bộ nội dung file `supabase/schema.sql`.
4. Chạy toàn bộ nội dung file `supabase/seed.sql`.

File `schema.sql` sẽ drop các bảng Tiembac cũ và tạo lại schema ecommerce.
File `seed.sql` sẽ thêm dữ liệu sản phẩm, danh mục, collection, tồn kho, video, review, blog, coupon và settings.

## Kiểm tra sau khi seed

Mở Table Editor và kiểm tra các bảng:

```txt
products
product_variants
product_images
categories
collections
inventory_items
product_videos
reviews
blog_posts
coupons
settings
```

Sau khi bảng `products` có dữ liệu active, website sẽ đọc Supabase trước. Mock data chỉ còn là fallback khi Supabase chưa có bảng hoặc chưa có data.
