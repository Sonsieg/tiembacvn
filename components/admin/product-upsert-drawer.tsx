"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { Category, Collection, Product, ProductVariant } from "@/types/commerce";
import { AdminDrawer, ConfirmDialog } from "@/components/admin/shared/admin-overlays";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ImageUploader, PriceInput, SearchableMultiSelect, SlugInput, TagSelector, YoutubeUrlInput } from "@/components/form/advanced-fields";
import { formatCurrency, slugify } from "@/lib/utils/format";

const tabs = ["Thông tin cơ bản", "Ảnh sản phẩm", "Biến thể & giá", "Danh mục & bộ sưu tập", "Tồn kho", "Video review", "SEO"];
const tagOptions = ["Hàng mới", "Bán chạy", "Đang sale", "Quà tặng", "Limited", "Sắp hết hàng"].map((label) => ({ label, value: label }));

type EditableVariant = Pick<ProductVariant, "id" | "title" | "sku" | "size" | "color" | "active" | "inventory"> & {
  originalPrice: number;
  discountAmount: number;
};

export function ProductUpsertDrawer({ open, product, categories, collections, onClose }: { open: boolean; product?: Product | null; categories: Category[]; collections: Collection[]; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [images, setImages] = useState(product?.images?.length ? product.images : ["", "", ""]);
  const [categoryValues, setCategoryValues] = useState(product?.categorySlugs ?? []);
  const [collectionValues, setCollectionValues] = useState(product?.collectionSlugs ?? []);
  const [tagValues, setTagValues] = useState<string[]>(product?.tags ?? []);
  const [variants, setVariants] = useState<EditableVariant[]>(() => initialVariants(product));
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const categoryOptions = useMemo(() => categories.map((category) => ({ label: category.name, value: category.slug })), [categories]);
  const collectionOptions = useMemo(() => collections.map((collection) => ({ label: collection.name, value: collection.slug })), [collections]);

  function markDirty() {
    if (!dirty) setDirty(true);
  }

  function requestClose() {
    if (dirty) setConfirmClose(true);
    else onClose();
  }

  function closeAnyway() {
    setConfirmClose(false);
    setDirty(false);
    onClose();
  }

  function updateVariant(index: number, patch: Partial<EditableVariant>) {
    setVariants((current) => current.map((variant, itemIndex) => itemIndex === index ? { ...variant, ...patch } : variant));
    markDirty();
  }

  function addVariant() {
    setVariants((current) => [...current, createVariantDraft(product?.id ?? "new", current.length)]);
    markDirty();
  }

  function removeVariant(index: number) {
    setVariants((current) => current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : current);
    markDirty();
  }

  return (
    <>
      <AdminDrawer
        open={open}
        title={product ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        description="Cập nhật nhanh sản phẩm trong cùng ngữ cảnh danh sách."
        onClose={requestClose}
        width="max-w-5xl"
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="secondary" onClick={requestClose}>Hủy</Button>
            <Button type="button"><Save className="h-4 w-4" /> Lưu sản phẩm</Button>
          </div>
        }
      >
        <div className="grid gap-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => <button key={tab} type="button" className={activeTab === tab ? "admin-tab is-active" : "admin-tab"} onClick={() => setActiveTab(tab)}>{tab}</button>)}
          </div>

          {activeTab === "Thông tin cơ bản" ? (
            <section className="admin-panel">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Tên sản phẩm"><Input value={title} onChange={(event) => { setTitle(event.target.value); if (!slug) setSlug(slugify(event.target.value)); markDirty(); }} placeholder="Moonlight Serenade Ring" /></Field>
                <SlugInput title={title} value={slug} onChange={(value) => { setSlug(value); markDirty(); }} />
              </div>
              <Field label="Mô tả ngắn"><Input defaultValue={product?.shortDescription} onChange={markDirty} placeholder="Nhẫn bạc S925 tối giản, sáng nhẹ..." /></Field>
              <Field label="Mô tả sản phẩm"><Textarea defaultValue={product?.description} onChange={markDirty} className="min-h-40" /></Field>
              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Chất liệu"><Input defaultValue={product?.material ?? "Bạc S925"} onChange={markDirty} /></Field>
                <Field label="Trọng lượng"><Input defaultValue={product?.weight} onChange={markDirty} /></Field>
                <Field label="Bảo hành"><Input defaultValue={product ? `${product.warrantyMonths} tháng` : "6 tháng"} onChange={markDirty} /></Field>
                <Field label="Trạng thái"><Select defaultValue={product?.status === "inactive" ? "inactive" : "active"} onChange={markDirty}><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
              </div>
            </section>
          ) : null}

          {activeTab === "Ảnh sản phẩm" ? <section className="admin-panel"><ImageUploader urls={images} onChange={(value) => { setImages(value); markDirty(); }} /></section> : null}

          {activeTab === "Biến thể & giá" ? (
            <section className="admin-panel">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[.16em] text-slate">Biến thể & giá</h2>
                  <p className="mt-1 text-sm text-slate-muted">Nhập giá gốc và giảm giá, giá bán sẽ tự tính cho từng size/biến thể.</p>
                </div>
                <Button type="button" variant="secondary" onClick={addVariant}><Plus className="h-4 w-4" /> Thêm biến thể</Button>
              </div>
              <div className="grid gap-4">
                {variants.map((variant, index) => {
                  const salePrice = variantSalePrice(variant);
                  return (
                    <article key={variant.id} className="grid gap-4 rounded-sm border border-line bg-pearl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-ink">Biến thể {index + 1}</h3>
                        <button type="button" className="admin-icon-danger" onClick={() => removeVariant(index)} disabled={variants.length <= 1} aria-label={`Xóa biến thể ${index + 1}`} title="Xóa biến thể">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Tên biến thể"><Input value={variant.title} onChange={(event) => updateVariant(index, { title: event.target.value })} placeholder="Size M, Size L, Freesize..." /></Field>
                        <Field label="SKU"><Input value={variant.sku} onChange={(event) => updateVariant(index, { sku: event.target.value })} placeholder="TB-SKU-SIZE" /></Field>
                        <Field label="Size"><Input value={variant.size ?? ""} onChange={(event) => updateVariant(index, { size: event.target.value })} placeholder="M, L, XL, 5, 6..." /></Field>
                        <Field label="Trạng thái"><Select value={variant.active ? "active" : "inactive"} onChange={(event) => updateVariant(index, { active: event.target.value === "active" })}><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <PriceInput label="Giá gốc" value={variant.originalPrice} onChange={(value) => updateVariant(index, { originalPrice: value })} />
                        <PriceInput label="Giảm giá" value={variant.discountAmount} onChange={(value) => updateVariant(index, { discountAmount: Math.min(value, variant.originalPrice) })} />
                        <div className="rounded-sm border border-line bg-ivory-soft p-4">
                          <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Giá bán tự tính</p>
                          <b className="mt-2 block text-lg text-cta">{formatCurrency(salePrice)}</b>
                          <p className="mt-1 text-xs text-slate-muted">{variant.discountAmount > 0 ? `Giá gốc ${formatCurrency(variant.originalPrice)} - giảm ${formatCurrency(variant.discountAmount)}` : "Không giảm giá"}</p>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Tồn khả dụng"><Input type="number" min={0} value={variant.inventory.quantityAvailable} onChange={(event) => updateVariant(index, { inventory: { ...variant.inventory, quantityAvailable: Number(event.target.value) } })} /></Field>
                        <Field label="Đang reserve"><Input type="number" min={0} value={variant.inventory.quantityReserved} onChange={(event) => updateVariant(index, { inventory: { ...variant.inventory, quantityReserved: Number(event.target.value) } })} /></Field>
                        <Field label="Ngưỡng sắp hết"><Input type="number" min={0} value={variant.inventory.lowStockThreshold} onChange={(event) => updateVariant(index, { inventory: { ...variant.inventory, lowStockThreshold: Number(event.target.value) } })} /></Field>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {activeTab === "Danh mục & bộ sưu tập" ? (
            <section className="admin-panel">
              <SearchableMultiSelect label="Danh mục" options={categoryOptions} values={categoryValues} onChange={(values) => { setCategoryValues(values); markDirty(); }} />
              <SearchableMultiSelect label="Bộ sưu tập" options={collectionOptions} values={collectionValues} onChange={(values) => { setCollectionValues(values); markDirty(); }} />
              <TagSelector label="Tag hiển thị" options={tagOptions} values={tagValues} onChange={(values) => { setTagValues(values); markDirty(); }} />
            </section>
          ) : null}

          {activeTab === "Tồn kho" ? (
            <section className="admin-panel">
              <VariantInventorySummary variants={variants} />
            </section>
          ) : null}

          {activeTab === "Video review" ? <section className="admin-panel"><YoutubeUrlInput value={youtubeUrl} onChange={(value) => { setYoutubeUrl(value); markDirty(); }} /></section> : null}

          {activeTab === "SEO" ? (
            <section className="admin-panel">
              <Field label="SEO title"><Input defaultValue={product?.seoTitle ?? `${title} | Tiembac.vn`} onChange={markDirty} /></Field>
              <Field label="SEO description"><Textarea defaultValue={product?.seoDescription} onChange={markDirty} /></Field>
              <Field label="OG image URL"><Input defaultValue={product?.ogImage} onChange={markDirty} placeholder="Supabase Storage URL" /></Field>
            </section>
          ) : null}
        </div>
      </AdminDrawer>
      <ConfirmDialog open={confirmClose} title="Bạn có thay đổi chưa lưu" description="Bạn có chắc muốn đóng drawer và bỏ các chỉnh sửa hiện tại không?" confirmLabel="Đóng không lưu" onConfirm={closeAnyway} onClose={() => setConfirmClose(false)} />
    </>
  );
}

function initialVariants(product?: Product | null): EditableVariant[] {
  if (product?.variants.length) {
    return product.variants.map((variant) => {
      const originalPrice = variantOriginalPrice(variant);
      return {
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        active: variant.active,
        inventory: variant.inventory,
        originalPrice,
        discountAmount: Math.max(originalPrice - variant.price, 0),
      };
    });
  }

  return [createVariantDraft("new", 0)];
}

function createVariantDraft(productId: string, index: number): EditableVariant {
  return {
    id: `${productId}-draft-${index + 1}`,
    title: index === 0 ? "Freesize" : `Biến thể ${index + 1}`,
    sku: "",
    size: "",
    color: "Bạc",
    active: true,
    inventory: {
      variantId: `${productId}-draft-${index + 1}`,
      quantityAvailable: 0,
      quantityReserved: 0,
      quantitySold: 0,
      lowStockThreshold: 3,
    },
    originalPrice: 0,
    discountAmount: 0,
  };
}

function variantOriginalPrice(variant: ProductVariant) {
  return variant.compareAtPrice && variant.compareAtPrice > variant.price ? variant.compareAtPrice : variant.price;
}

function variantSalePrice(variant: EditableVariant) {
  return Math.max(variant.originalPrice - variant.discountAmount, 0);
}

function VariantInventorySummary({ variants }: { variants: EditableVariant[] }) {
  return (
    <div className="overflow-hidden rounded-sm border border-line bg-pearl">
      <div className="border-b border-line p-4">
        <h2 className="text-sm font-bold uppercase tracking-[.16em] text-slate">Tồn kho theo biến thể</h2>
        <p className="mt-1 text-sm text-slate-muted">Tồn kho được quản lý theo từng size/biến thể ở tab Biến thể & giá.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-ivory-soft text-slate-muted">
            <tr><th className="p-3">Biến thể</th><th>SKU</th><th>Khả dụng</th><th>Reserve</th><th>Đã bán</th><th>Ngưỡng sắp hết</th></tr>
          </thead>
          <tbody>
            {variants.map((variant) => {
              const available = Math.max(variant.inventory.quantityAvailable - variant.inventory.quantityReserved, 0);
              return (
                <tr key={variant.id} className={available <= 0 ? "border-t border-line bg-danger/5" : "border-t border-line"}>
                  <td className={available <= 0 ? "p-3 font-semibold text-danger" : "p-3 font-semibold text-ink"}>{variant.title}</td>
                  <td>{variant.sku || "Chưa có SKU"}</td>
                  <td className={available <= 0 ? "font-semibold text-danger" : undefined}>{available <= 0 ? "Hết hàng" : available}</td>
                  <td>{variant.inventory.quantityReserved}</td>
                  <td>{variant.inventory.quantitySold}</td>
                  <td>{variant.inventory.lowStockThreshold}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
