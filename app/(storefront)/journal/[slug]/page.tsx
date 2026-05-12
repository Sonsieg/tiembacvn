import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductGrid } from "@/components/product/product-grid";
import { articleSchema } from "@/lib/seo/schema";
import { getBlogPostBySlug } from "@/lib/services/blog.service";
import { getProducts } from "@/lib/services/product.service";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) return {};
  return { title: post.seoTitle, description: post.seoDescription, openGraph: { images: [post.coverImage] } };
}

export default async function JournalDetailPage({ params }: Props) {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) notFound();
  const products = (await getProducts()).slice(0, 4);
  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <article className="section">
        <div className="container-page max-w-4xl">
          <p className="eyebrow">Journal</p>
          <h1 className="heading-lg">{post.title}</h1>
          <p className="mt-4 text-gray-600">{post.excerpt}</p>
          <img src={post.coverImage} alt={post.title} className="mt-8 aspect-[16/8] w-full rounded-[2rem] object-cover shadow-soft" />
          <div className="prose prose-lg mt-8 max-w-none text-gray-700">
            {post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </article>
      <section className="section bg-white">
        <div className="container-page grid gap-8">
          <div><p className="eyebrow">Gợi ý mua sắm</p><h2 className="heading-lg">Sản phẩm hợp với bài viết</h2></div>
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}
