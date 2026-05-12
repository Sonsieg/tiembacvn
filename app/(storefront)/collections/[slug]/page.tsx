import type { Metadata } from "next";
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
  return (
    <section className="section">
      <div className="container-page grid gap-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-claret p-8 text-white md:p-12">
          <img src={(category ?? collection)!.image} alt={(category ?? collection)!.name} className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="relative max-w-2xl">
            <p className="text-sm uppercase text-sky-100">Tiembac.vn</p>
            <h1 className="heading-lg">{(category ?? collection)!.name}</h1>
            <p className="mt-4 text-white/75">{(category ?? collection)!.description}</p>
          </div>
        </div>
        <CollectionBrowser products={products} categories={categories} />
      </div>
    </section>
  );
}
