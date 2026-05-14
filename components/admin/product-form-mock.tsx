"use client";

import Link from "next/link";
import { Archive, CheckCircle2, ImagePlus, MinusCircle, Plus, Save, Sparkles, Trash2, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Collection, Product, ProductVariant } from "@/types/commerce";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { slugify } from "@/lib/utils/format";

type EditableVariant = Pick<ProductVariant, "id" | "title" | "sku" | "size" | "color" | "price" | "compareAtPrice" | "active"> & {
  discountPercent: number;
};

const statusOptions: [string, LucideIcon, string][] = [
  ["active", CheckCircle2, "Active"],
  ["draft", MinusCircle, "Draft"],
  ["archived", Archive, "Archived"],
];

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
  const toast = useToast();
  const [name, setName] = useState(product?.title ?? "");
  const slug = useMemo(() => slugify(name), [name]);
  const [status, setStatus] = useState(product?.status === "active" ? "active" : "draft");
  const [mediaUrls, setMediaUrls] = useState<string[]>(product?.images?.length ? product.images : ["", "", ""]);
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
    toast({ tone: "info", title: "Đã thêm biến thể", description: "Biến thể mới đang ở bản nháp sản phẩm." });
  }

  function updateVariant(index: number, patch: Partial<EditableVariant>) {
    setVariants((current) => current.map((variant, itemIndex) => (itemIndex === index ? { ...variant, ...patch } : variant)));
  }

  function updateMediaUrl(index: number, value: string) {
    setMediaUrls((current) => current.map((url, itemIndex) => (itemIndex === index ? value : url)));
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow"><Link href="/admin/products">Catalog management</Link></p>
          <h1 className="admin-display-title">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">Ảnh sản phẩm dùng Supabase Storage URL hoặc URL ảnh ngoài để không lưu file nặng trong codebase.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products" className="admin-pill-link">Discard</Link>
          <Button type="button" onClick={() => toast({ tone: "info", title: "Đã lưu bản nháp sản phẩm", description: "Form sản phẩm legacy đang ở UI preview, chưa ghi database." })}><Save size={16} /> Save product</Button>
        </div>
      </div>

      <form className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">Product details</p>
                <h2>Thông tin sản phẩm</h2>
              </div>
              <Sparkles className="h-5 w-5 text-sky-700" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Product title"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Moonlight Serenade Ring" /></Field>
              <Field label="URL slug"><Input value={slug} readOnly /></Field>
            </div>
            <Field label="Short description"><Input defaultValue={product?.shortDescription} placeholder="Nhẫn bạc S925 tối giản, sáng nhẹ và dễ đeo hằng ngày" /></Field>
            <Field label="Product description"><Textarea defaultValue={product?.description} className="min-h-44" placeholder="Mô tả chất liệu, cảm hứng thiết kế, hoàn thiện bề mặt và gợi ý phối đồ..." /></Field>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">Attributes & specifications</p>
                <h2>Thuộc tính bán hàng</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Danh mục"><Select defaultValue={product?.categorySlugs[0]}>{categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}</Select></Field>
              <Field label="Collection"><Select defaultValue={product?.collectionSlugs[0]}>{collections.map((collection) => <option key={collection.id} value={collection.slug}>{collection.name}</option>)}</Select></Field>
              <Field label="Chất liệu"><Input defaultValue={product?.material ?? "Bạc S925"} /></Field>
              <Field label="Bảo hành"><Input defaultValue={product ? `${product.warrantyMonths} tháng` : "6 tháng"} /></Field>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Field label="Trọng lượng"><Input defaultValue={product?.weight} placeholder="2.5g" /></Field>
              <Field label="Đá / chi tiết"><Input defaultValue={product?.stone ?? ""} placeholder="Không / CZ stone" /></Field>
              <Field label="Link review"><Input value={reviewLink} onChange={(event) => setReviewLink(event.target.value)} placeholder="TikTok, YouTube, bài viết..." /></Field>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">Variants</p>
                <h2>Biến thể sản phẩm</h2>
              </div>
              <button type="button" className="admin-action-button" onClick={addVariant}><Plus size={16} /> Thêm biến thể</button>
            </div>
            <div className="grid gap-3">
              {variants.map((variant, index) => (
                <div key={variant.id} className="admin-variant-row">
                  <Field label="Size / tên biến thể"><Input value={variant.title} onChange={(event) => updateVariant(index, { title: event.target.value, size: event.target.value })} /></Field>
                  <Field label="SKU tự tăng"><Input value={variant.sku || makeSku(slug || "san-pham", index + 1)} onChange={(event) => updateVariant(index, { sku: event.target.value })} /></Field>
                  <Field label="Giá bán"><Input type="number" value={variant.price} onChange={(event) => updateVariant(index, { price: Number(event.target.value) })} /></Field>
                  <Field label="% giảm"><Input type="number" value={variant.discountPercent} onChange={(event) => updateVariant(index, { discountPercent: Number(event.target.value) })} /></Field>
                  <Field label="Màu"><Input value={variant.color ?? "Bạc"} onChange={(event) => updateVariant(index, { color: event.target.value })} /></Field>
                  <Field label="Giá gốc"><Input type="number" value={variant.compareAtPrice ?? ""} onChange={(event) => updateVariant(index, { compareAtPrice: Number(event.target.value) || undefined })} /></Field>
                  <Field label="Trạng thái"><Select value={variant.active ? "active" : "inactive"} onChange={(event) => updateVariant(index, { active: event.target.value === "active" })}><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
                  <button type="button" className="admin-icon-danger" onClick={() => { setVariants((current) => current.filter((_, itemIndex) => itemIndex !== index)); toast({ tone: "warning", title: "Đã xoá biến thể", description: "Biến thể đã bị xoá khỏi bản nháp." }); }} aria-label="Xóa biến thể"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid h-fit gap-5">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">Product status</p>
                <h2>Trạng thái</h2>
              </div>
              <span className="admin-status-chip">{status}</span>
            </div>
            <div className="admin-status-grid">
              {statusOptions.map(([value, Icon, label]) => (
                <button key={value as string} type="button" className={status === value ? "admin-status-card is-active" : "admin-status-card"} onClick={() => setStatus(value as string)}>
                  <Icon className="h-4 w-4" />
                  <span>{label as string}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">Media</p>
                <h2>Ảnh bằng URL</h2>
              </div>
              <button type="button" className="admin-action-button" onClick={() => { setMediaUrls((current) => [...current, ""]); toast({ tone: "info", title: "Đã thêm ô ảnh", description: "Dán URL ảnh để preview sản phẩm." }); }}><ImagePlus size={16} /> Add</button>
            </div>
            <div className="admin-media-grid">
              {mediaUrls.map((url, index) => (
                <div key={index} className="admin-media-card">
                  {url ? <img src={url} alt={`Preview sản phẩm ${index + 1}`} /> : <div className="admin-media-empty"><ImagePlus className="h-5 w-5" /> URL ảnh</div>}
                  <Input value={url} onChange={(event) => updateMediaUrl(index, event.target.value)} placeholder="https://.../image.jpg" aria-label={`URL ảnh ${index + 1}`} />
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">SEO</p>
                <h2>Search preview</h2>
              </div>
            </div>
            <div className="grid gap-4">
              <Field label="SEO title"><Input defaultValue={product?.seoTitle} placeholder={`${name || "Tên sản phẩm"} | Tiembac.vn`} /></Field>
              <Field label="SEO description"><Textarea defaultValue={product?.seoDescription} placeholder="Meta description khoảng 140-160 ký tự, nêu chất liệu, kiểu dáng và lợi ích chính." /></Field>
              <Field label="OG image URL"><Input defaultValue={product?.ogImage} placeholder="Supabase Storage URL" /></Field>
            </div>
          </section>
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
