import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionBrowser } from "@/components/product/collection-browser";
import { getCategories, getCollections, getProductsByCategory, getProductsByCollection } from "@/lib/services/product.service";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [categories, collections] = await Promise.all([getCategories(), getCollections()]);
  const category = categories.find((item) => item.slug === slug);
  const collection = collections.find((item) => item.slug === slug);
  const entity = category ?? collection;
  return {
    title: entity ? entity.name : "Bộ sưu tập",
    description: entity?.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const [categories, collections] = await Promise.all([getCategories(), getCollections()]);
  const category = categories.find((item) => item.slug === slug);
  const collection = collections.find((item) => item.slug === slug);
  if (!category && !collection) notFound();
  const products = category ? await getProductsByCategory(slug) : await getProductsByCollection(slug);
  const entity = (category ?? collection)!;
  return (
    <section className="section bg-ivory">
      <div className="container-page grid gap-8">
        <div className="grid overflow-hidden rounded-[1rem] border border-line bg-pearl shadow-soft lg:grid-cols-[1fr_360px]">
          <div className="p-6 md:p-10">
            <nav className="mb-5 text-xs font-bold uppercase tracking-[.14em] text-slate-light" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-cta">Trang chủ</Link>
              <span className="mx-2 text-silver-dark">/</span>
              <Link href="/collections" className="hover:text-cta">Bộ sưu tập</Link>
              <span className="mx-2 text-silver-dark">/</span>
              <span className="text-slate-muted">{entity.name}</span>
            </nav>
            <p className="eyebrow">Tiembac.vn</p>
            <h1 className="heading-lg max-w-3xl text-navy">{entity.name}</h1>
            <p className="mt-4 max-w-2xl text-slate-muted">{entity.description}</p>
          </div>
          <div className="relative min-h-64 border-t border-line bg-ivory-soft lg:border-l lg:border-t-0">
            <img src={entity.image} alt={entity.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/48 via-transparent to-transparent" />
          </div>
        </div>
        <CollectionBrowser products={products} categories={categories} />
      </div>
    </section>
  );
}
