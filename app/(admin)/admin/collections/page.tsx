import { getCollections } from "@/lib/services/product.service";
import { EntityManager } from "@/components/admin/entity-manager";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();
  return <EntityManager eyebrow="Collections" title="Bộ sưu tập" description="Tạo, sửa và xem nhanh collection trong drawer." fields={["Name", "Slug", "Description", "Image", "Featured", "Sort order"]} rows={collections.map((collection) => ({ Name: collection.name, Slug: collection.slug, Description: collection.description, Image: collection.image, Featured: collection.featured ? "Featured" : "Nhóm phụ" }))} />;
}
