import type { Category, Collection } from "@/types/commerce";

export const categories: Category[] = [
  {
    id: "cat-rings",
    name: "Nhẫn bạc",
    slug: "nhan-bac",
    description: "Nhẫn bạc S925 thanh lịch cho mỗi ngày và dịp đặc biệt.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
    active: true,
  },
  {
    id: "cat-necklaces",
    name: "Dây chuyền bạc",
    slug: "day-chuyen-bac",
    description: "Dây chuyền bạc mảnh, sáng và dễ phối nhiều phong cách.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
    active: true,
  },
  {
    id: "cat-bracelets",
    name: "Vòng tay bạc",
    slug: "vong-tay-bac",
    description: "Vòng tay và lắc tay bạc tinh tế, hợp làm quà tặng.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop",
    active: true,
  },
  {
    id: "cat-earrings",
    name: "Bông tai bạc",
    slug: "bong-tai-bac",
    description: "Bông tai bạc nhẹ, sáng, tôn đường nét khuôn mặt.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1200&auto=format&fit=crop",
    active: true,
  },
  {
    id: "cat-charms",
    name: "Charm bạc",
    slug: "charm-bac",
    description: "Charm bạc nhỏ xinh để kể câu chuyện riêng của bạn.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop",
    active: true,
  },
  {
    id: "cat-gifts",
    name: "Quà tặng",
    slug: "qua-tang",
    description: "Những món trang sức bạc được gói quà trang nhã.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
    active: true,
  },
];

export const collections: Collection[] = [
  {
    id: "col-signature",
    name: "Signature Collection",
    slug: "signature",
    description: "Thiết kế biểu tượng với ánh bạc tinh giản, sang và dễ đeo.",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "col-gift",
    name: "Gift Collection",
    slug: "gift",
    description: "Trang sức bạc kèm gói quà tinh tế cho người thương.",
    image: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1400&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "col-minimal",
    name: "Minimal Shine",
    slug: "minimal-shine",
    description: "Đường nét mảnh, sáng và nữ tính cho phong cách tối giản.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1400&auto=format&fit=crop",
  },
];
