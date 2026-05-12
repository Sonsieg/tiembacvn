import type { Metadata } from "next";
import Link from "next/link";
import { WishlistBrowser } from "@/components/product/wishlist-browser";
import { getProducts } from "@/lib/services/product.service";

export const metadata: Metadata = {
  title: "Sản phẩm yêu thích",
  description: "Danh sách sản phẩm trang sức bạc S925 bạn đã lưu tại Tiembac.vn.",
};

export default async function WishlistPage() {
  const products = await getProducts();
  return (
    <section className="section bg-ivory">
      <div className="container-page grid gap-8">
        <div className="rounded-[1rem] border border-line bg-pearl p-6 shadow-soft md:p-10">
          <nav className="mb-5 text-xs font-bold uppercase tracking-[.14em] text-slate-light" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-cta">Trang chủ</Link>
            <span className="mx-2 text-silver-dark">/</span>
            <span className="text-slate-muted">Yêu thích</span>
          </nav>
          <p className="eyebrow">Wishlist</p>
          <h1 className="heading-lg max-w-4xl text-navy">Sản phẩm đã yêu thích</h1>
          <p className="mt-4 max-w-2xl text-slate-muted">Những món bạc bạn đã lưu lại để cân nhắc, so sánh và mua nhanh hơn.</p>
        </div>
        <WishlistBrowser products={products} />
      </div>
    </section>
  );
}
