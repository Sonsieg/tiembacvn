import { getAdminCategories } from "@/lib/services/product.service";
import { EntityManager } from "@/components/admin/entity-manager";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return <EntityManager entity="categories" eyebrow="Categories" title="Danh mục sản phẩm" description="Quản lý danh mục hiển thị ở storefront, ảnh đại diện, slug SEO và trạng thái active/inactive." fields={["Tên", "Slug", "Mô tả", "Ảnh", "Active", "Sort order"]} rows={categories.map((category) => ({ id: category.id, Tên: category.name, Slug: category.slug, "Mô tả": category.description, Ảnh: category.image, Active: category.active ? "Active" : "Inactive" }))} />;
}
