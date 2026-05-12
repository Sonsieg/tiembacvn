import { ProductFormMock } from "@/components/admin/product-form-mock";
import { getCategories, getCollections, getProductById } from "@/lib/services/product.service";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, collections] = await Promise.all([getProductById(id), getCategories(), getCollections()]);
  return <ProductFormMock title={product ? `Chỉnh sửa ${product.title}` : `Chỉnh sửa sản phẩm ${id}`} product={product} categories={categories} collections={collections} />;
}
