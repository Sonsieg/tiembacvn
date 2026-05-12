import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductInfo } from "@/components/product/product-info";
import { ProductVideoSection } from "@/components/product/product-video-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/constants/site";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/product.service";
import { getProductVideos } from "@/lib/services/video.service";
import { breadcrumbSchema, productSchema } from "@/lib/seo/schema";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: [product.ogImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const [videos, related] = await Promise.all([getProductVideos(product.id), getRelatedProducts(product.id, product.categorySlugs)]);

  return (
    <>
      <JsonLd data={productSchema(product)} />
      <JsonLd data={breadcrumbSchema([{ name: "Trang chủ", url: siteConfig.url }, { name: "Sản phẩm", url: `${siteConfig.url}/collections` }, { name: product.title, url: `${siteConfig.url}/products/${product.slug}` }])} />
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_.9fr]">
          <ProductGallery images={product.images} title={product.title} />
          <ProductInfo product={product} />
        </div>
      </section>
      <section className="pb-16">
        <div className="container-page grid gap-4 md:grid-cols-2">
          {[
            ["Mô tả sản phẩm", product.description],
            ["Hướng dẫn bảo quản", product.careGuide],
            ["Chính sách bảo hành", `Bảo hành ${product.warrantyMonths} tháng cho lỗi sản xuất. Hỗ trợ làm sáng bạc tại cửa hàng.`],
            ["Giao hàng & đổi trả", "Giao hàng toàn quốc, miễn phí từ 900.000đ. Hỗ trợ đổi size theo chính sách Tiembac.vn."],
          ].map(([title, content]) => (
            <Card key={title} className="p-5">
              <h2 className="flex items-center justify-between font-semibold text-ink">{title}<ChevronDown className="h-4 w-4 text-claret" /></h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{content}</p>
            </Card>
          ))}
        </div>
      </section>
      <ProductVideoSection videos={videos} />
      <section className="section bg-white">
        <div className="container-page grid gap-8">
          <div><p className="eyebrow">Có thể bạn thích</p><h2 className="heading-lg">Sản phẩm liên quan</h2></div>
          <ProductGrid products={related} />
        </div>
      </section>
    </>
  );
}
