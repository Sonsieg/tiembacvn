import { ProductFormMock } from "@/components/admin/product-form-mock";
import { getCategories, getCollections } from "@/lib/services/product.service";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([getCategories(), getCollections()]);
  return <ProductFormMock title="Tạo sản phẩm mới" categories={categories} collections={collections} />;
}
