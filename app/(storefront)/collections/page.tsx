import type { Metadata } from "next";
import Link from "next/link";
import { CollectionBrowser } from "@/components/product/collection-browser";
import { getCategories, getProducts } from "@/lib/services/product.service";

export const metadata: Metadata = {
  title: "Bộ sưu tập trang sức bạc",
  description: "Khám phá nhẫn bạc, dây chuyền bạc, vòng tay bạc, bông tai bạc và quà tặng bạc S925 tại Tiembac.vn.",
};

export default async function CollectionsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <section className="section bg-ivory">
      <div className="container-page grid gap-8">
        <div className="rounded-[1rem] border border-line bg-[linear-gradient(135deg,#FFFFFF_0%,#FFFDF8_54%,#F5EFE6_100%)] p-6 shadow-soft md:p-10">
          <nav className="mb-5 text-xs font-bold uppercase tracking-[.14em] text-slate-light" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-cta">Trang chủ</Link>
            <span className="mx-2 text-silver-dark">/</span>
            <span className="text-slate-muted">Bộ sưu tập</span>
          </nav>
          <p className="eyebrow">Bộ sưu tập</p>
          <h1 className="heading-lg max-w-4xl text-navy">Trang sức bạc S925 cho từng khoảnh khắc</h1>
          <p className="mt-4 max-w-2xl text-slate-muted">Tìm sản phẩm theo loại, khoảng giá, phong cách và dịp tặng. Tất cả đều hỗ trợ mua hàng nhanh mà không cần tạo tài khoản.</p>
        </div>
        <CollectionBrowser products={products} categories={categories} />
      </div>
    </section>
  );
}
