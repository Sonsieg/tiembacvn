import { ArrowRight, Gift, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductGrid } from "@/components/product/product-grid";
import { getApprovedReviews } from "@/lib/services/review.service";
import { getFeaturedVideos } from "@/lib/services/video.service";
import { getBlogPosts } from "@/lib/services/blog.service";
import { getCategories, getCollections, getProducts } from "@/lib/services/product.service";
import { ProductVideoSection } from "@/components/product/product-video-section";

export default async function HomePage() {
  const [products, reviews, videos, posts, categories, collections] = await Promise.all([
    getProducts(),
    getApprovedReviews(),
    getFeaturedVideos(),
    getBlogPosts(),
    getCategories(),
    getCollections(),
  ]);
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 4);
  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 4);

  return (
    <>
      <section className="relative isolate min-h-[calc(100svh-96px)] overflow-hidden bg-claret text-white">
        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1800&auto=format&fit=crop" alt="Trang sức bạc Tiembac.vn" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-34" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(156,216,238,.45),transparent_28%),linear-gradient(120deg,rgba(67,16,29,.98),rgba(90,22,40,.72),rgba(32,25,28,.88))]" />
        <div className="container-page grid min-h-[calc(100svh-96px)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-3xl">
            <Badge className="border-white/25 bg-white/10 text-white">Bạc S925 · Gói quà tinh tế</Badge>
            <h1 className="heading-xl mt-6">Tiembac.vn — Vẻ đẹp tinh tế từ bạc</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">Trang sức bạc S925 thanh lịch, hiện đại và được chọn lọc cho từng khoảnh khắc.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/collections" size="lg">Mua ngay <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="/collections/signature" variant="secondary" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">Khám phá bộ sưu tập</ButtonLink>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              {[
                [ShieldCheck, "Bạc S925"],
                [Gift, "Gói quà tinh tế"],
                [RotateCcw, "Đổi size dễ dàng"],
                [Sparkles, "Không cần đăng nhập"],
              ].map(([Icon, label]) => (
                <div key={label as string} className="glass rounded-2xl px-3 py-3">
                  <Icon className="mb-2 h-5 w-5 text-sky-200" />
                  {label as string}
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden min-h-[520px] lg:block">
            <div className="metallic absolute right-8 top-10 h-72 w-72 rounded-full opacity-90 blur-[1px]" />
            <FloatingCard className="left-0 top-16" image="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop" title="Moonlight Ring" />
            <FloatingCard className="right-0 top-48" image="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop" title="Stellar Heart" />
            <FloatingCard className="bottom-12 left-20" image="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop" title="Minimal Shine" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-8">
          <div className="flex items-end justify-between gap-4">
            <div><p className="eyebrow">Danh mục nổi bật</p><h2 className="heading-lg">Chọn món bạc của riêng bạn</h2></div>
            <ButtonLink href="/collections" variant="secondary">Xem tất cả</ButtonLink>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <a key={category.id} href={`/collections/${category.slug}`} className="group overflow-hidden rounded-[1.5rem] bg-white shadow-soft">
                <div className="aspect-square overflow-hidden"><img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <div className="p-4"><h3 className="font-semibold text-ink">{category.name}</h3><p className="mt-1 text-xs text-gray-500">{category.description}</p></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page grid gap-8">
          <div><p className="eyebrow">New arrivals</p><h2 className="heading-lg">Vừa cập nhật tại Tiembac.vn</h2></div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-8">
          <div><p className="eyebrow">Best sellers</p><h2 className="heading-lg">Những thiết kế được yêu thích</h2></div>
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      <section className="section bg-claret text-white">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {collections.filter((collection) => collection.featured).map((collection) => (
            <a key={collection.id} href={`/collections/${collection.slug}`} className="group relative min-h-96 overflow-hidden rounded-[2rem] p-8">
              <img src={collection.image} alt={collection.name} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="relative mt-56">
                <p className="text-sm uppercase text-sky-100">{collection.name}</p>
                <h3 className="mt-2 text-3xl font-semibold">{collection.description}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      <ProductVideoSection videos={videos} />

      <section className="section bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="eyebrow">Brand story</p><h2 className="heading-lg">Một khoảng sáng nhỏ cho từng khoảnh khắc</h2></div>
          <div className="grid gap-4 text-gray-600">
            <p>Tiembac.vn chọn bạc S925, đường nét tinh giản và trải nghiệm mua hàng nhẹ nhàng. Khách có thể đặt hàng nhanh, không cần tạo tài khoản, vẫn được tư vấn size và gói quà chỉn chu.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[["12 tháng", "Bảo hành chọn lọc"], ["900K", "Miễn phí vận chuyển"], ["S925", "Chất liệu bạc chuẩn"]].map(([value, label]) => <Card key={label} className="p-5"><b className="text-2xl text-claret">{value}</b><p className="text-sm">{label}</p></Card>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-8">
          <div><p className="eyebrow">Khách hàng nói gì</p><h2 className="heading-lg">Đẹp từ hộp quà đến ánh bạc</h2></div>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.slice(0, 6).map((review) => <Card key={review.id} className="p-5"><p className="text-gray-600">“{review.comment}”</p><b className="mt-4 block text-claret">{review.customerName}</b></Card>)}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page grid gap-8">
          <div className="flex items-end justify-between"><div><p className="eyebrow">Journal</p><h2 className="heading-lg">Cẩm nang trang sức bạc</h2></div><ButtonLink href="/journal" variant="secondary">Đọc thêm</ButtonLink></div>
          <div className="grid gap-4 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <a key={post.id} href={`/journal/${post.slug}`} className="overflow-hidden rounded-[1.5rem] bg-pearl shadow-soft">
                <img src={post.coverImage} alt={post.title} className="aspect-[16/10] w-full object-cover" />
                <div className="p-5"><h3 className="font-semibold text-ink">{post.title}</h3><p className="mt-2 text-sm text-gray-500">{post.excerpt}</p></div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FloatingCard({ image, title, className }: { image: string; title: string; className: string }) {
  return (
    <div className={`absolute w-64 overflow-hidden rounded-[2rem] border border-white/20 bg-white/12 p-3 shadow-premium backdrop-blur-xl ${className}`}>
      <img src={image} alt={title} className="aspect-square rounded-[1.5rem] object-cover" />
      <div className="p-3 text-sm font-medium">{title}</div>
    </div>
  );
}
