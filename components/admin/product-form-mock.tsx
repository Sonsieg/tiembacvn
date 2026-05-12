"use client";

import Link from "next/link";
import { Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Collection, Product, ProductVariant } from "@/types/commerce";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { slugify } from "@/lib/utils/format";

type EditableVariant = Pick<ProductVariant, "id" | "title" | "sku" | "size" | "color" | "price" | "compareAtPrice" | "active"> & {
  discountPercent: number;
};

export function ProductFormMock({
  title,
  product,
  categories,
  collections,
}: {
  title: string;
  product?: Product | null;
  categories: Category[];
  collections: Collection[];
}) {
  const [name, setName] = useState(product?.title ?? "");
  const slug = useMemo(() => slugify(name), [name]);
  const [status, setStatus] = useState(product?.status === "active" ? "active" : "inactive");
  const [reviewLink, setReviewLink] = useState("");
  const [variants, setVariants] = useState<EditableVariant[]>(
    product?.variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      active: variant.active,
      discountPercent: variant.compareAtPrice ? Math.round(100 - (variant.price / variant.compareAtPrice) * 100) : 0,
    })) ?? [createVariant(slug || "san-pham", 1)],
  );

  function addVariant() {
    setVariants((current) => [...current, createVariant(slug || "san-pham", current.length + 1)]);
  }

  function updateVariant(index: number, patch: Partial<EditableVariant>) {
    setVariants((current) => current.map((variant, itemIndex) => (itemIndex === index ? { ...variant, ...patch } : variant)));
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow"><Link href="/admin/products">Sản phẩm</Link> / {product ? "Chỉnh sửa" : "Tạo mới"}</p>
          <h1 className="text-2xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">Slug tự parse từ tên sản phẩm và không cho sửa tay để giữ URL SEO ổn định.</p>
        </div>
        <Link href="/admin/products" className="rounded-full border border-silver-200 bg-white px-4 py-2 text-sm text-claret">← Trở lại danh sách</Link>
      </div>

      <form className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tên sản phẩm"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nhẫn bạc S925 Moonlight" /></Field>
            <Field label="Slug SEO"><Input value={slug} readOnly /></Field>
          </div>
          <Field label="Mô tả ngắn"><Input defaultValue={product?.shortDescription} /></Field>
          <Field label="Mô tả đầy đủ"><Textarea defaultValue={product?.description} /></Field>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Chất liệu"><Input defaultValue={product?.material ?? "Bạc S925"} /></Field>
            <Field label="Trọng lượng"><Input defaultValue={product?.weight} /></Field>
            <Field label="Bảo hành"><Input defaultValue={product ? `${product.warrantyMonths} tháng` : "12 tháng"} /></Field>
            <Field label="Trạng thái"><Select value={status} onChange={(event) => setStatus(event.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
          </div>

          <div className="rounded-[2rem] border border-silver-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-semibold text-ink">Biến thể sản phẩm</h2><p className="mt-2 text-sm text-gray-500">Thêm size/màu/biến thể. SKU tự tăng dần theo slug hiện tại.</p></div>
              <button type="button" className="rounded-full border border-silver-200 bg-white px-4 py-2 text-sm text-claret" onClick={addVariant}><Plus size={16} /> Thêm biến thể</button>
            </div>
            <div className="mt-4 grid gap-3">
              {variants.map((variant, index) => (
                <div key={variant.id} className="grid gap-3 rounded-2xl bg-pearl p-3 md:grid-cols-4">
                  <Field label="Size / tên biến thể"><Input value={variant.title} onChange={(event) => updateVariant(index, { title: event.target.value, size: event.target.value })} /></Field>
                  <Field label="SKU tự tăng"><Input value={variant.sku || makeSku(slug || "san-pham", index + 1)} onChange={(event) => updateVariant(index, { sku: event.target.value })} /></Field>
                  <Field label="Giá bán"><Input type="number" value={variant.price} onChange={(event) => updateVariant(index, { price: Number(event.target.value) })} /></Field>
                  <Field label="% giảm giá"><Input type="number" value={variant.discountPercent} onChange={(event) => updateVariant(index, { discountPercent: Number(event.target.value) })} /></Field>
                  <Field label="Màu"><Input value={variant.color ?? "Bạc"} onChange={(event) => updateVariant(index, { color: event.target.value })} /></Field>
                  <Field label="Giá gốc"><Input type="number" value={variant.compareAtPrice ?? ""} onChange={(event) => updateVariant(index, { compareAtPrice: Number(event.target.value) || undefined })} /></Field>
                  <Field label="Trạng thái"><Select value={variant.active ? "active" : "inactive"} onChange={(event) => updateVariant(index, { active: event.target.value === "active" })}><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
                  <button type="button" className="h-fit self-end rounded-full border border-silver-200 bg-white px-4 py-2 text-sm text-claret" onClick={() => setVariants((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={16} /> Xóa</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="grid h-fit gap-4 rounded-[2rem] bg-white p-5 shadow-soft">
          <Field label="Danh mục"><Select defaultValue={product?.categorySlugs[0]}>{categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}</Select></Field>
          <Field label="Nhóm / collection"><Select defaultValue={product?.collectionSlugs[0]}>{collections.map((collection) => <option key={collection.id} value={collection.slug}>{collection.name}</option>)}</Select></Field>
          <Field label="Link review / linkup detail"><Input value={reviewLink} onChange={(event) => setReviewLink(event.target.value)} placeholder="YouTube, TikTok, bài review..." /></Field>
          <Field label="SEO title"><Input defaultValue={product?.seoTitle} /></Field>
          <Field label="SEO description"><Textarea defaultValue={product?.seoDescription} /></Field>
          <Field label="OG image"><Input defaultValue={product?.ogImage} placeholder="Supabase Storage URL" /></Field>
          <Button type="button"><Save size={16} /> Lưu thay đổi</Button>
        </aside>
      </form>
    </div>
  );
}

function makeSku(slug: string, index: number) {
  return `TB-${slugify(slug).replaceAll("-", "").slice(0, 10).toUpperCase()}-${String(index).padStart(3, "0")}`;
}

function createVariant(slug: string, index: number): EditableVariant {
  const label = `Biến thể ${index}`;
  return {
    id: `new-${index}`,
    title: label,
    sku: makeSku(slug, index),
    size: label,
    color: "Bạc",
    price: 0,
    active: true,
    discountPercent: 0,
  };
}
