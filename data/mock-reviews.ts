import type { Review } from "@/types/commerce";

const comments = [
  "Đóng gói rất đẹp, phù hợp làm quà.",
  "Bạc sáng, đeo lên tay rất tinh tế.",
  "Shop tư vấn size rất chuẩn.",
  "Sản phẩm ngoài đời đẹp hơn ảnh.",
  "Giao hàng nhanh, hộp quà xinh.",
];

export const reviews: Review[] = [
  "moonlight",
  "stellar-heart",
  "minimal-shine",
  "pearl-drop",
  "lucky-star",
  "claret-stone",
].flatMap((productId, productIndex) =>
  comments.slice(0, 3).map((comment, index) => ({
    id: `${productId}-review-${index}`,
    productId,
    customerName: ["An Nhiên", "Minh Anh", "Khánh Linh"][index],
    rating: 5 - ((productIndex + index) % 2) * 0.2,
    comment,
    approved: true,
    createdAt: new Date(Date.now() - (productIndex * 3 + index) * 86400000).toISOString(),
  })),
);
