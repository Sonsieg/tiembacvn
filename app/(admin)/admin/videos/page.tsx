import { EntityManager } from "@/components/admin/entity-manager";

export default function AdminVideosPage() {
  return <EntityManager eyebrow="Product videos" title="Video sản phẩm" description="Thêm, sửa và xem video bằng drawer. URL YouTube có thể tự parse ID trong form sản phẩm." fields={["Product", "YouTube URL", "Title", "Type", "Featured", "Active"]} rows={[{ Product: "Moonlight Ring", "YouTube URL": "https://youtube.com/watch?v=", Title: "Review sản phẩm", Type: "Review", Featured: "Yes", Active: "Active" }]} />;
}
