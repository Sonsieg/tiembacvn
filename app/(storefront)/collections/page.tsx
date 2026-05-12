import type { Metadata } from "next";
import { CollectionBrowser } from "@/components/product/collection-browser";
import { getCategories, getProducts } from "@/lib/services/product.service";

export const metadata: Metadata = {
  title: "Bộ sưu tập trang sức bạc",
  description: "Khám phá nhẫn bạc, dây chuyền bạc, vòng tay bạc, bông tai bạc và quà tặng bạc S925 tại Tiembac.vn.",
};

export default async function CollectionsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <section className="section">
      <div className="container-page grid gap-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Bộ sưu tập</p>
          <h1 className="heading-lg">Trang sức bạc S925 cho từng khoảnh khắc</h1>
          <p className="mt-4 text-gray-600">Tìm sản phẩm theo loại, giá, phong cách và trạng thái tồn kho. Tất cả đều hỗ trợ guest checkout.</p>
        </div>
        <CollectionBrowser products={products} categories={categories} />
      </div>
    </section>
  );
}
