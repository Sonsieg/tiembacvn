import {
  ArrowRight,
  Gem,
  Gift,
  RotateCcw,
  ShoppingBag,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductGrid } from "@/components/product/product-grid";
import { getBlogPosts } from "@/lib/services/blog.service";
import {
  getCategories,
  getCollections,
  getProducts,
} from "@/lib/services/product.service";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

// Giữ cache trong 60 giây (ISR). Web load cực nhanh như trang tĩnh, vừa tự động cập nhật data mới sau mỗi phút.
export const revalidate = 60;

const trustBadges: [LucideIcon, string, string][] = [
  [Gem, "Bạc S925", "Chất liệu sáng nhẹ, rõ nguồn gốc và dễ đeo hằng ngày."],
  [
    Gift,
    "Gói quà tinh tế",
    "Hộp quà và túi tặng kèm cho những đơn hàng cần trao gửi.",
  ],
  [
    RotateCcw,
    "Đổi size dễ dàng",
    "Hỗ trợ đổi size theo chính sách sau khi nhận sản phẩm.",
  ],
  [
    ShoppingBag,
    "Mua không cần đăng nhập",
    "Đặt hàng nhanh, mã đơn gửi để bạn tra cứu bất cứ lúc nào.",
  ],
];

const collectionFallbacks = [
  [
    "Nhẫn bạc",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=900&auto=format&fit=crop",
  ],
  [
    "Dây chuyền bạc",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop",
  ],
  [
    "Vòng tay bạc",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=900&auto=format&fit=crop",
  ],
  [
    "Khuyên tai bạc",
    "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=900&auto=format&fit=crop",
  ],
];

const testimonials = [
  {
    name: "Minh Anh",
    context: "Mua nhẫn bạc làm quà sinh nhật",
    quote:
      "Sản phẩm ngoài đời sáng và tinh tế hơn ảnh. Hộp quà rất chỉn chu nên mình gửi tặng được ngay.",
  },
  {
    name: "Hoài Phương",
    context: "Chọn dây chuyền đeo hằng ngày",
    quote:
      "Thiết kế mảnh, nhẹ, phối áo sơ mi hay váy đều ổn. Tư vấn size và bảo quản cũng rất dễ hiểu.",
  },
  {
    name: "Ngọc Hân",
    context: "Đặt combo quà tặng",
    quote:
      "Checkout nhanh, không cần tạo tài khoản. Mã đơn được gửi rõ ràng nên theo dõi rất yên tâm.",
  },
];

export default async function HomePage() {
  const [products, posts, categories, collections] = await Promise.all([
    getProducts(),
    getBlogPosts(),
    getCategories(),
    getCollections(),
  ]);
  const newArrivals = products
    .filter((product) => product.newArrival)
    .slice(0, 4);
  const bestSellers = products
    .filter((product) => product.bestSeller)
    .slice(0, 4);
  const giftProducts = products
    .filter(
      (product) =>
        product.collectionSlugs.includes("gift") ||
        product.categorySlugs.includes("gifts") ||
        product.giftWrap,
    )
    .slice(0, 4);
  const giftCollection = giftProducts.length
    ? giftProducts
    : products.filter((product) => product.featured).slice(0, 4);
  const featuredCategories = categories.slice(0, 4);
  const premiumCollections = collections
    .filter((collection) => collection.featured)
    .slice(0, 2);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />

      <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#FFFDF8_0%,#FAF7F0_48%,#EEF8FA_100%)]">
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(180deg,rgba(201,168,93,0.16),transparent)]" />
        <div className="container-page grid min-h-[calc(100svh-104px)] gap-10 py-12 md:py-16 lg:grid-cols-[1fr_.86fr] lg:items-center">
          <div className="max-w-3xl animate-[fadeIn_.8s_ease_both]">
            <Badge className="border-cta/35 bg-cta-soft text-navy">
              Bạc S925 · Trang sức bạc cao cấp
            </Badge>
            <h1 className="heading-xl mt-6 text-navy">
              Thanh lịch trong từng ánh bạc
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-muted md:text-lg">
              Những thiết kế bạc S925 thanh mảnh, sáng sang và dễ phối, được
              hoàn thiện để trở thành món trang sức mỗi ngày hoặc một món quà
              thật chỉn chu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/collections" size="lg">
                Mua ngay <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/collections" variant="secondary" size="lg">
                Khám phá bộ sưu tập
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustBadges.map(([Icon, title]) => (
                <span
                  key={title as string}
                  className="inline-flex items-center gap-2 rounded-sm border border-line bg-pearl/78 px-3 py-2 text-xs font-bold uppercase tracking-[.12em] text-slate shadow-soft"
                >
                  <Icon className="h-4 w-4 text-cta" />
                  {title as string}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-8 hidden h-32 w-32 rounded-full border border-cta/35 bg-cta-soft/70 lg:block" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-line bg-navy p-3 shadow-premium">
              <img
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1400&auto=format&fit=crop"
                alt="Người mẫu đeo trang sức bạc S925 tinh tế của Tiembac.vn"
                className="aspect-[4/5] w-full rounded-[1rem] object-cover"
              />
              <div className="absolute inset-x-3 bottom-3 rounded-b-[1rem] bg-gradient-to-t from-navy/92 via-navy/44 to-transparent p-5 text-ivory">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-cta-soft">
                  Bộ sưu tập mới
                </p>
                <h2 className="mt-2 font-display text-3xl leading-none">
                  Ánh bạc nhẹ, vẻ đẹp lâu bền
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-pearl">
        <div className="container-page grid gap-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map(([Icon, title, description]) => (
            <div key={title as string} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-ivory-soft text-cta">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-slate">
                  {title as string}
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-muted">
                  {description as string}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container-page grid gap-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Danh mục nổi bật</p>
              <h2 className="heading-lg text-navy">
                Chọn món bạc của riêng bạn
              </h2>
            </div>
            <ButtonLink href="/collections" variant="secondary">
              Xem tất cả
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((category, index) => (
              <a
                key={category.id}
                href={`/collections/${category.slug}`}
                className="group overflow-hidden rounded-sm border border-line bg-pearl shadow-soft transition duration-300 hover:-translate-y-1 hover:border-cta/55"
              >
                <div className="aspect-[4/5] overflow-hidden bg-ivory-soft">
                  <img
                    src={category.image || collectionFallbacks[index]?.[1]}
                    alt={`Bộ sưu tập ${category.name || collectionFallbacks[index]?.[0]} bạc S925`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <h3 className="font-display text-2xl font-semibold text-slate">
                    {category.name || collectionFallbacks[index]?.[0]}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-cta transition group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ProductSection
        eyebrow="Hàng mới"
        title="Sản phẩm mới về"
        description="Những thiết kế vừa lên kệ, sáng nhẹ và dễ phối cho nhịp sống thường ngày."
      >
        <ProductGrid products={newArrivals} />
      </ProductSection>

      <ProductSection
        eyebrow="Được yêu thích"
        title="Bán chạy nhất"
        description="Các món bạc được chọn nhiều nhờ phom dáng dễ đeo, hoàn thiện sạch và giá trị quà tặng tốt."
        tone="warm"
      >
        <ProductGrid products={bestSellers} />
      </ProductSection>

      <ProductSection
        eyebrow="Quà tặng"
        title="Bộ quà tặng"
        description="Gợi ý trang sức bạc có gói quà tinh tế, phù hợp sinh nhật, kỷ niệm và những lời cảm ơn nhỏ."
      >
        <ProductGrid products={giftCollection} />
      </ProductSection>

      {premiumCollections.length ? (
        <section className="section bg-ivory-soft">
          <div className="container-page grid gap-5 md:grid-cols-2">
            {premiumCollections.map((collection) => (
              <a
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group relative min-h-[360px] overflow-hidden rounded-[1rem] border border-line bg-navy text-ivory shadow-soft"
              >
                <img
                  src={collection.image}
                  alt={`Bộ sưu tập ${collection.name}`}
                  className="absolute inset-0 h-full w-full object-cover opacity-72 transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/88 via-navy/28 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[.16em] text-cta-soft">
                    {collection.name}
                  </p>
                  <h3 className="mt-3 max-w-md font-display text-4xl leading-none">
                    {collection.description}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section bg-ivory-warm">
        <div className="container-page grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
          <div className="overflow-hidden rounded-[1rem] border border-line bg-pearl p-3 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&auto=format&fit=crop"
              alt="Chi tiết trang sức bạc được hoàn thiện tinh tế"
              className="aspect-[5/4] w-full rounded-sm object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Câu chuyện thương hiệu</p>
            <h2 className="heading-lg text-navy">
              Tinh tế trong từng chi tiết bạc
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-muted">
              Tiembac.vn theo đuổi vẻ đẹp tối giản: đường nét sạch, chất liệu
              bạc S925 và cách đóng gói đủ trang nhã để một món quà nhỏ vẫn có
              cảm giác được chăm chút.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["S925", "Chất liệu bạc chuẩn"],
                ["7 ngày", "Đổi size linh hoạt"],
                ["6 tháng", "Bảo hành sản phẩm"],
              ].map(([value, label]) => (
                <Card key={label} className="border-line p-5 shadow-none">
                  <b className="font-display text-4xl font-medium text-navy">
                    {value}
                  </b>
                  <p className="mt-2 text-sm text-slate-muted">{label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section bg-ivory-soft">
        <div className="container-page grid gap-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Cẩm nang</p>
              <h2 className="heading-lg text-navy">Cẩm nang trang sức bạc</h2>
            </div>
            <ButtonLink href="/journal" variant="secondary">
              Đọc thêm
            </ButtonLink>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <a
                key={post.id}
                href={`/journal/${post.slug}`}
                className="group overflow-hidden rounded-sm border border-line bg-pearl shadow-soft transition duration-300 hover:-translate-y-1 hover:border-cta/55"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-cta">
                    Cẩm nang
                  </p>
                  <h3 className="mt-2 font-semibold text-slate">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-muted">
                    {post.excerpt}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductSection({
  eyebrow,
  title,
  description,
  children,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  tone?: "light" | "warm";
}) {
  return (
    <section
      className={`section ${tone === "warm" ? "bg-ivory-warm" : "bg-ivory"}`}
    >
      <div className="container-page grid gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="heading-lg text-navy">{title}</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-muted">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
