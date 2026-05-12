import { ProductAdminWorkspace } from "@/components/admin/product-admin-workspace";
import { getAdminProducts, getCategories, getCollections } from "@/lib/services/product.service";

export default async function AdminProductsPage() {
  const [products, categories, collections] = await Promise.all([getAdminProducts(), getCategories(), getCollections()]);
  return <ProductAdminWorkspace products={products} categories={categories} collections={collections} />;
}
