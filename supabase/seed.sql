begin;

insert into categories (id, name, slug, description, image, active) values
('00000000-0000-0000-0000-000000000101','Nhẫn bạc','nhan-bac','Nhẫn bạc S925 thanh lịch cho mỗi ngày và dịp đặc biệt.','https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',true),
('00000000-0000-0000-0000-000000000102','Dây chuyền bạc','day-chuyen-bac','Dây chuyền bạc mảnh, sáng và dễ phối nhiều phong cách.','https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',true),
('00000000-0000-0000-0000-000000000103','Vòng tay bạc','vong-tay-bac','Vòng tay và lắc tay bạc tinh tế, hợp làm quà tặng.','https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop',true),
('00000000-0000-0000-0000-000000000104','Bông tai bạc','bong-tai-bac','Bông tai bạc nhẹ, sáng, tôn đường nét khuôn mặt.','https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1200&auto=format&fit=crop',true),
('00000000-0000-0000-0000-000000000105','Charm bạc','charm-bac','Charm bạc nhỏ xinh để kể câu chuyện riêng của bạn.','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',true),
('00000000-0000-0000-0000-000000000106','Quà tặng','qua-tang','Trang sức bạc được gói quà trang nhã.','https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',true);

insert into collections (id, name, slug, description, image, featured, active) values
('00000000-0000-0000-0000-000000000201','Signature Collection','signature','Thiết kế biểu tượng với ánh bạc tinh giản, sang và dễ đeo.','https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1400&auto=format&fit=crop',true,true),
('00000000-0000-0000-0000-000000000202','Gift Collection','gift','Trang sức bạc kèm gói quà tinh tế cho người thương.','https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1400&auto=format&fit=crop',true,true),
('00000000-0000-0000-0000-000000000203','Minimal Shine','minimal-shine','Đường nét mảnh, sáng và nữ tính cho phong cách tối giản.','https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1400&auto=format&fit=crop',false,true);

insert into products (id, title, slug, short_description, description, care_guide, material, weight, stone, plating, warranty_months, gift_wrap, rating, review_count, featured, best_seller, new_arrival, tags, status, seo_title, seo_description, og_image) values
('00000000-0000-0000-0000-000000001001','Nhẫn bạc S925 Moonlight','nhan-bac-s925-moonlight','Ánh trăng dịu trên nền bạc S925 sáng trong.','Thiết kế nhẫn mảnh với bề mặt đánh bóng gương, điểm xuyết đá CZ trắng cho hiệu ứng lấp lánh vừa đủ.','Tránh tiếp xúc hóa chất mạnh, lau bằng khăn mềm sau khi đeo.','Bạc S925','2.8g','CZ trắng','Rhodium chống xỉn',12,true,4.9,48,true,true,true,array['thanh lịch','đi làm','quà tặng'],'active','Nhẫn bạc S925 Moonlight | Tiembac.vn','Nhẫn bạc S925 Moonlight thanh lịch, sáng đẹp, có gói quà và đổi size dễ dàng.','https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop'),
('00000000-0000-0000-0000-000000001002','Dây chuyền bạc Stellar Heart','day-chuyen-bac-stellar-heart','Mặt tim bạc nhỏ với ánh sao tinh tế.','Dây chuyền bạc S925 dáng mảnh, mặt trái tim cách điệu mềm mại.','Tháo khi tắm, bơi hoặc dùng nước hoa.','Bạc S925','3.2g','CZ trắng','Bạch kim',12,true,4.8,36,true,true,false,array['tim','quà tặng','hẹn hò'],'active','Dây chuyền bạc Stellar Heart | Tiembac.vn','Dây chuyền bạc S925 Stellar Heart nữ tính, sang trọng, phù hợp làm quà.','https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop'),
('00000000-0000-0000-0000-000000001003','Vòng tay bạc Minimal Shine','vong-tay-bac-minimal-shine','Lắc tay bạc tối giản với điểm sáng mềm.','Dáng vòng mảnh nhẹ, khóa chắc, bề mặt bạc sáng lạnh tạo cảm giác thanh thoát khi đeo.','Lau sạch mồ hôi sau khi đeo.','Bạc S925','4.5g',null,'Rhodium',6,true,4.7,24,false,false,true,array['minimal','đi làm'],'active','Vòng tay bạc Minimal Shine | Tiembac.vn','Vòng tay bạc S925 Minimal Shine tinh giản, sáng đẹp, dễ phối đồ.','https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop'),
('00000000-0000-0000-0000-000000001004','Bông tai bạc Pearl Drop','bong-tai-bac-pearl-drop','Bông tai bạc dáng giọt ngọc dịu dàng.','Thiết kế ôm sát tai, điểm nhấn ngọc trai nhân tạo ánh trắng.','Tránh nước hoa và kem dưỡng tiếp xúc trực tiếp.','Bạc S925','2.4g','Ngọc trai nhân tạo','Rhodium',6,true,4.9,52,false,true,false,array['ngọc trai','nữ tính'],'active','Bông tai bạc Pearl Drop | Tiembac.vn','Bông tai bạc S925 Pearl Drop nhẹ, nữ tính, phù hợp mọi dịp.','https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1200&auto=format&fit=crop'),
('00000000-0000-0000-0000-000000001005','Charm bạc Lucky Star','charm-bac-lucky-star','Charm ngôi sao bạc cho lời chúc may mắn.','Charm bạc nhỏ, phù hợp phối cùng vòng tay hoặc dây chuyền.','Cất trong túi riêng, tránh va đập mạnh.','Bạc S925','1.9g',null,'Bạch kim',6,true,4.6,19,true,false,false,array['ngôi sao','may mắn'],'active','Charm bạc Lucky Star | Tiembac.vn','Charm bạc S925 Lucky Star nhỏ xinh, sáng đẹp, hợp làm quà tặng.','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop'),
('00000000-0000-0000-0000-000000001006','Nhẫn bạc Claret Stone','nhan-bac-claret-stone','Viên đá đỏ trầm trên nền bạc sáng lạnh.','Nhẫn bạc S925 có đá đỏ rượu vang, tạo điểm nhấn sang và khác biệt cho bàn tay.','Không đeo khi vận động mạnh.','Bạc S925','3.1g','Đá tổng hợp đỏ claret','Rhodium',12,true,4.8,31,false,false,true,array['claret','đá màu'],'active','Nhẫn bạc Claret Stone | Tiembac.vn','Nhẫn bạc Claret Stone với đá đỏ sang trọng, bảo hành 12 tháng.','https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1200&auto=format&fit=crop');

insert into product_images (product_id, url, alt, sort_order)
select id, og_image, title, 0 from products;

insert into product_categories (product_id, category_id) values
('00000000-0000-0000-0000-000000001001','00000000-0000-0000-0000-000000000101'),
('00000000-0000-0000-0000-000000001001','00000000-0000-0000-0000-000000000106'),
('00000000-0000-0000-0000-000000001002','00000000-0000-0000-0000-000000000102'),
('00000000-0000-0000-0000-000000001002','00000000-0000-0000-0000-000000000106'),
('00000000-0000-0000-0000-000000001003','00000000-0000-0000-0000-000000000103'),
('00000000-0000-0000-0000-000000001004','00000000-0000-0000-0000-000000000104'),
('00000000-0000-0000-0000-000000001005','00000000-0000-0000-0000-000000000105'),
('00000000-0000-0000-0000-000000001005','00000000-0000-0000-0000-000000000106'),
('00000000-0000-0000-0000-000000001006','00000000-0000-0000-0000-000000000101');

insert into product_collections (product_id, collection_id) values
('00000000-0000-0000-0000-000000001001','00000000-0000-0000-0000-000000000201'),
('00000000-0000-0000-0000-000000001001','00000000-0000-0000-0000-000000000202'),
('00000000-0000-0000-0000-000000001002','00000000-0000-0000-0000-000000000202'),
('00000000-0000-0000-0000-000000001002','00000000-0000-0000-0000-000000000203'),
('00000000-0000-0000-0000-000000001003','00000000-0000-0000-0000-000000000203'),
('00000000-0000-0000-0000-000000001004','00000000-0000-0000-0000-000000000202'),
('00000000-0000-0000-0000-000000001005','00000000-0000-0000-0000-000000000202'),
('00000000-0000-0000-0000-000000001006','00000000-0000-0000-0000-000000000201');

insert into product_variants (id, product_id, title, sku, size, color, price, compare_at_price, cost_price, active) values
('00000000-0000-0000-0000-000000002001','00000000-0000-0000-0000-000000001001','Size 5','TB-MOONLIGHT-5','5','Bạc',420000,510000,193000,true),
('00000000-0000-0000-0000-000000002002','00000000-0000-0000-0000-000000001001','Size 6','TB-MOONLIGHT-6','6','Bạc',430000,null,198000,true),
('00000000-0000-0000-0000-000000002003','00000000-0000-0000-0000-000000001002','40cm','TB-STELLAR-40','40cm','Bạc',560000,650000,258000,true),
('00000000-0000-0000-0000-000000002004','00000000-0000-0000-0000-000000001002','45cm','TB-STELLAR-45','45cm','Bạc',570000,null,262000,true),
('00000000-0000-0000-0000-000000002005','00000000-0000-0000-0000-000000001003','16cm','TB-MINIMAL-16','16cm','Bạc',620000,710000,285000,true),
('00000000-0000-0000-0000-000000002006','00000000-0000-0000-0000-000000001004','Tiêu chuẩn','TB-PEARL-STD','Tiêu chuẩn','Bạc',390000,480000,179000,true),
('00000000-0000-0000-0000-000000002007','00000000-0000-0000-0000-000000001005','Tiêu chuẩn','TB-STAR-STD','Tiêu chuẩn','Bạc',280000,null,129000,true),
('00000000-0000-0000-0000-000000002008','00000000-0000-0000-0000-000000001006','Size 7','TB-CLARET-7','7','Bạc',680000,770000,313000,true);

insert into inventory_items (variant_id, quantity_available, quantity_reserved, quantity_sold, low_stock_threshold) values
('00000000-0000-0000-0000-000000002001',9,0,24,4),
('00000000-0000-0000-0000-000000002002',7,1,18,4),
('00000000-0000-0000-0000-000000002003',12,0,21,4),
('00000000-0000-0000-0000-000000002004',10,1,15,4),
('00000000-0000-0000-0000-000000002005',7,0,14,4),
('00000000-0000-0000-0000-000000002006',14,0,31,4),
('00000000-0000-0000-0000-000000002007',5,0,12,4),
('00000000-0000-0000-0000-000000002008',6,0,16,4);

insert into coupons (code, type, value, min_order_total, usage_limit, used, active) values
('TIEMBAC10','percentage',10,500000,500,83,true),
('FREESHIP','free_shipping',0,300000,300,122,true);

insert into product_videos (product_id, youtube_url, youtube_id, title, thumbnail_url, type, sort_order, featured, status) values
('00000000-0000-0000-0000-000000001001','https://www.youtube.com/watch?v=dQw4w9WgXcQ','dQw4w9WgXcQ','Review nhẫn Moonlight dưới ánh sáng tự nhiên','https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg','Review',1,true,'active'),
('00000000-0000-0000-0000-000000001002','https://youtu.be/ysz5S6PUM-U','ysz5S6PUM-U','Đeo thử dây chuyền Stellar Heart','https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg','Đeo thử',2,true,'active');

insert into reviews (product_id, customer_name, rating, comment, approved) values
('00000000-0000-0000-0000-000000001001','An Nhiên',5,'Đóng gói rất đẹp, phù hợp làm quà.',true),
('00000000-0000-0000-0000-000000001001','Minh Anh',4.8,'Bạc sáng, đeo lên tay rất tinh tế.',true),
('00000000-0000-0000-0000-000000001002','Khánh Linh',5,'Shop tư vấn size rất chuẩn.',true),
('00000000-0000-0000-0000-000000001004','Hà My',5,'Sản phẩm ngoài đời đẹp hơn ảnh.',true);

insert into blog_posts (title, slug, excerpt, cover_image, content, status, seo_title, seo_description, published_at) values
('Cách chọn size nhẫn bạc chuẩn tại nhà','cach-chon-size-nhan-bac-chuan-tai-nha','Hướng dẫn đo size nhẫn bằng giấy, thước và một vài lưu ý để nhẫn vừa tay.','https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&auto=format&fit=crop',array['Dùng một sợi giấy nhỏ quấn quanh ngón tay, đánh dấu điểm giao nhau rồi đo chiều dài bằng thước milimet.','Nên đo vào cuối ngày khi tay ở trạng thái ổn định.','Nếu phân vân giữa hai size, hãy chọn size lớn hơn để đeo thoải mái.'],'published','Cách chọn size nhẫn bạc chuẩn tại nhà | Tiembac.vn','Hướng dẫn chọn size nhẫn bạc đơn giản, dễ làm tại nhà.',now()),
('Cách bảo quản bạc S925 luôn sáng đẹp','cach-bao-quan-bac-s925-luon-sang-dep','Các thói quen nhỏ giúp trang sức bạc giữ được độ sáng và hạn chế xỉn màu.','https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1400&auto=format&fit=crop',array['Bạc S925 nên được lau bằng khăn mềm sau khi đeo.','Hãy tháo trang sức trước khi tắm, bơi, xịt nước hoa hoặc dùng mỹ phẩm.','Khi không dùng, cất bạc trong túi zip hoặc hộp riêng.'],'published','Cách bảo quản bạc S925 luôn sáng đẹp | Tiembac.vn','Mẹo bảo quản trang sức bạc S925 sáng đẹp lâu hơn.',now());

insert into shipping_methods (name, fee, free_threshold, active) values
('Giao hàng tiêu chuẩn',30000,900000,true);

insert into settings (key, value) values
('store', '{"name":"Tiembac.vn","phone":"0909 888 925","email":"chamsoc@tiembac.vn","shippingFee":30000,"freeShippingThreshold":900000}'::jsonb);

commit;
