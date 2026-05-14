import { getAdminCollections } from "@/lib/services/product.service";
import { EntityManager } from "@/components/admin/entity-manager";

export default async function AdminCollectionsPage() {
  const collections = await getAdminCollections();
  return <EntityManager entity="collections" eyebrow="Collections" title="Bộ sưu tập" description="Quản lý collection hiển thị ở storefront, ảnh đại diện, slug SEO và trạng thái active/inactive." fields={["Tên", "Slug", "Mô tả", "Ảnh", "Active", "Featured"]} rows={collections.map((collection) => ({ id: collection.id, Tên: collection.name, Slug: collection.slug, "Mô tả": collection.description, Ảnh: collection.image, Active: collection.active === false ? "Inactive" : "Active", Featured: collection.featured ? "Featured" : "Nhóm phụ" }))} />;
}
