import { EntityManager } from "@/components/admin/entity-manager";

export default function AdminReviewsPage() {
  return <EntityManager eyebrow="Reviews" title="Đánh giá" description="Xem, approve hoặc ẩn review nhanh trong drawer." fields={["Customer", "Product", "Rating", "Comment", "Status"]} rows={[{ Customer: "Khách hàng", Product: "Moonlight Ring", Rating: "5", Comment: "Đẹp và vừa tay", Status: "Pending" }]} />;
}
