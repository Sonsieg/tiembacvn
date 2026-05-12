"use client";

import { useMemo, useState } from "react";
import { Save, Send } from "lucide-react";
import type { Category, Collection, Product } from "@/types/commerce";
import { AdminDrawer, ConfirmDialog } from "@/components/admin/shared/admin-overlays";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { ImageUploader, PriceInput, SearchableMultiSelect, SlugInput, TagSelector, YoutubeUrlInput } from "@/components/form/advanced-fields";
import { slugify } from "@/lib/utils/format";

const tabs = ["Thông tin cơ bản", "Ảnh sản phẩm", "Biến thể & giá", "Danh mục & bộ sưu tập", "Tồn kho", "Video review", "SEO"];
const tagOptions = ["Hàng mới", "Bán chạy", "Đang sale", "Quà tặng", "Limited", "Sắp hết hàng"].map((label) => ({ label, value: label }));

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
  const [price, setPrice] = useState(product?.variants[0]?.price ?? 0);
  const [compareAtPrice, setCompareAtPrice] = useState(product?.variants[0]?.compareAtPrice ?? 0);
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
            <Button type="button" variant="secondary"><Save className="h-4 w-4" /> Lưu nháp</Button>
            <Button type="button"><Save className="h-4 w-4" /> Lưu thay đổi</Button>
            <Button type="button" variant="dark"><Send className="h-4 w-4" /> Đăng sản phẩm</Button>
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
                <Field label="Trạng thái"><Select defaultValue={product?.status ?? "draft"} onChange={markDirty}><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></Select></Field>
              </div>
            </section>
          ) : null}

          {activeTab === "Ảnh sản phẩm" ? <section className="admin-panel"><ImageUploader urls={images} onChange={(value) => { setImages(value); markDirty(); }} /></section> : null}

          {activeTab === "Biến thể & giá" ? (
            <section className="admin-panel">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Tên biến thể"><Input defaultValue={product?.variants[0]?.title ?? "Freesize"} onChange={markDirty} /></Field>
                <Field label="SKU"><Input defaultValue={product?.variants[0]?.sku ?? ""} onChange={markDirty} /></Field>
                <PriceInput label="Giá bán" value={price} onChange={(value) => { setPrice(value); markDirty(); }} />
                <PriceInput label="Giá gốc" value={compareAtPrice} onChange={(value) => { setCompareAtPrice(value); markDirty(); }} />
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
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Tồn khả dụng"><Input type="number" defaultValue={product?.variants[0]?.inventory.quantityAvailable ?? 0} min={0} onChange={markDirty} /></Field>
                <Field label="Đang reserve"><Input type="number" defaultValue={product?.variants[0]?.inventory.quantityReserved ?? 0} min={0} onChange={markDirty} /></Field>
                <Field label="Ngưỡng sắp hết"><Input type="number" defaultValue={product?.variants[0]?.inventory.lowStockThreshold ?? 3} min={0} onChange={markDirty} /></Field>
              </div>
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
