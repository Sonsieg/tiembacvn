import { getCategories } from "@/lib/services/product.service";
import { EntityManager } from "@/components/admin/entity-manager";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <EntityManager eyebrow="Categories" title="Danh mục sản phẩm" description="Thêm, sửa và xem nhanh danh mục bằng drawer." fields={["Name", "Slug", "Description", "Image", "Active", "Sort order"]} rows={categories.map((category) => ({ Name: category.name, Slug: category.slug, Description: category.description, Image: category.image, Active: category.active ? "Active" : "Hidden" }))} />;
}
