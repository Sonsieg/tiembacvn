"use client";

import { Archive, Copy, Eye, MoreHorizontal, Pencil, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Collection, Product } from "@/types/commerce";
import { AdminDrawer, ConfirmDialog } from "@/components/admin/shared/admin-overlays";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/form";
import { ProductUpsertDrawer } from "@/components/admin/product-upsert-drawer";
import { ActiveAdminFilters, AdminProductFilterDrawer, type AdminProductFilters } from "@/components/admin/product-filter-drawer";
import { formatCurrency } from "@/lib/utils/format";

export function ProductAdminWorkspace({ products, categories, collections }: { products: Product[]; categories: Category[]; collections: Collection[] }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<AdminProductFilters>({ statuses: [], categories: [], collections: [], stock: [], tags: [], minPrice: "", maxPrice: "" });
  const [sort, setSort] = useState("updated");
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filtered = useMemo(() => {
    return products
      .filter((product) => (query ? `${product.title} ${product.variants[0]?.sku ?? ""}`.toLowerCase().includes(query.toLowerCase()) : true))
      .filter((product) => (filters.statuses.length ? filters.statuses.includes(product.status) : true))
      .filter((product) => (filters.categories.length ? filters.categories.some((category) => product.categorySlugs.includes(category)) : true))
      .filter((product) => (filters.collections.length ? filters.collections.some((collection) => product.collectionSlugs.includes(collection)) : true))
      .filter((product) => {
        const prices = product.variants.map((variant) => variant.price);
        if (!prices.length) return true;
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return (!filters.minPrice || max >= Number(filters.minPrice)) && (!filters.maxPrice || min <= Number(filters.maxPrice));
      })
      .filter((product) => {
        if (!filters.stock.length) return true;
        const stock = stockCount(product);
        return filters.stock.some((item) => {
          if (item === "in-stock") return stock > 0;
          if (item === "out-stock") return stock <= 0;
          if (item === "low-stock") return stock > 0 && stock <= 3;
          if (item === "reserved") return product.variants.some((variant) => variant.inventory.quantityReserved > 0);
          return true;
        });
      })
      .filter((product) => {
        if (!filters.tags.length) return true;
        return filters.tags.some((tag) => {
          if (tag === "new") return product.newArrival;
          if (tag === "best") return product.bestSeller;
          if (tag === "sale") return product.variants.some((variant) => variant.compareAtPrice && variant.compareAtPrice > variant.price);
          if (tag === "featured") return product.featured;
          return product.tags.includes(tag);
        });
      })
      .sort((a, b) => {
        if (sort === "price-asc") return minPrice(a) - minPrice(b);
        if (sort === "price-desc") return minPrice(b) - minPrice(a);
        if (sort === "stock") return stockCount(a) - stockCount(b);
        return a.title.localeCompare(b.title, "vi");
      });
  }, [products, query, filters, sort]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((product) => selected.includes(product.id));

  function toggleSelected(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="admin-display-title">Sản phẩm</h1>
          <p className="mt-2 text-sm text-gray-500">Quản lý sản phẩm, biến thể, tồn kho và SEO.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminProductFilterDrawer categories={categories} collections={collections} filters={filters} onChange={setFilters} />
          <Button type="button" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Thêm sản phẩm</Button>
        </div>
      </div>

      <section className="admin-panel">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input className="pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên sản phẩm hoặc SKU..." />
          </div>
          <Select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="updated">Cập nhật mới</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="stock">Sắp hết hàng</option>
          </Select>
          <Button type="button" variant="secondary" onClick={() => setFilters({ statuses: [], categories: [], collections: [], stock: [], tags: [], minPrice: "", maxPrice: "" })}>Xóa lọc</Button>
        </div>
        <ActiveAdminFilters filters={filters} categories={categories} collections={collections} onChange={setFilters} />
      </section>

      {selected.length ? (
        <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-claret/50 bg-claret/12 p-3">
          <span className="text-sm font-semibold text-claret">Đã chọn {selected.length} sản phẩm</span>
          <div className="flex flex-wrap gap-2">
            {["Đưa về Active", "Chuyển Draft", "Archive", "Gắn collection", "Cập nhật tag"].map((label) => <Button key={label} type="button" variant="secondary" size="sm" onClick={() => setConfirmOpen(true)}>{label}</Button>)}
            <Button type="button" size="sm" onClick={() => setSelected([])}>Bỏ chọn</Button>
          </div>
        </div>
      ) : null}

      <section className="admin-table-card">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead>
              <tr>
                <th className="p-4"><input type="checkbox" checked={allVisibleSelected} onChange={() => setSelected(allVisibleSelected ? [] : filtered.map((product) => product.id))} aria-label="Chọn tất cả" /></th>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Bộ sưu tập</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Badge</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => <ProductRow key={product.id} product={product} selected={selected.includes(product.id)} onSelect={() => toggleSelected(product.id)} onView={() => setViewing(product)} onEdit={() => setEditing(product)} onArchive={() => setConfirmOpen(true)} />)}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 lg:hidden">
          {filtered.map((product) => <ProductCardRow key={product.id} product={product} selected={selected.includes(product.id)} onSelect={() => toggleSelected(product.id)} onView={() => setViewing(product)} onEdit={() => setEditing(product)} />)}
        </div>
      </section>

      <ProductUpsertDrawer key={createOpen ? "create-open" : "create-closed"} open={createOpen} categories={categories} collections={collections} onClose={() => setCreateOpen(false)} />
      <ProductUpsertDrawer key={editing?.id ?? "edit-closed"} open={Boolean(editing)} product={editing} categories={categories} collections={collections} onClose={() => setEditing(null)} />
      <ProductQuickViewDrawer product={viewing} onClose={() => setViewing(null)} onEdit={(product) => { setViewing(null); setEditing(product); }} />
      <ConfirmDialog open={confirmOpen} description="Thao tác này đang ở chế độ UI preview. Khi nối write API, hệ thống sẽ cập nhật các sản phẩm đã chọn sau bước xác nhận." onConfirm={() => setConfirmOpen(false)} onClose={() => setConfirmOpen(false)} />
    </div>
  );
}

function ProductRow({ product, selected, onSelect, onView, onEdit, onArchive }: { product: Product; selected: boolean; onSelect: () => void; onView: () => void; onEdit: () => void; onArchive: () => void }) {
  return (
    <tr className="border-t border-silver-200 align-middle hover:bg-sky-50/45">
      <td className="p-4"><input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Chọn ${product.title}`} /></td>
      <td className="py-4">
        <div className="flex items-center gap-3">
          <img src={product.images[0]} alt={product.title} className="h-14 w-14 rounded-2xl object-cover" />
          <div><b className="text-foreground">{product.title}</b><p className="text-xs text-gray-500">{product.variants[0]?.sku ?? "Chưa có SKU"}</p></div>
        </div>
      </td>
      <td>{product.categorySlugs.join(", ")}</td>
      <td>{product.collectionSlugs.join(", ")}</td>
      <td>{formatPriceRange(product)}</td>
      <td><StockBadge product={product} /></td>
      <td><StatusBadge status={product.status} /></td>
      <td><ProductBadges product={product} /></td>
      <td>Hôm nay</td>
      <td><QuickActions onView={onView} onEdit={onEdit} onArchive={onArchive} /></td>
    </tr>
  );
}

function ProductCardRow({ product, selected, onSelect, onView, onEdit }: { product: Product; selected: boolean; onSelect: () => void; onView: () => void; onEdit: () => void }) {
  return (
    <article className="rounded-2xl border border-silver-200 bg-white p-4">
      <div className="flex gap-3">
        <input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Chọn ${product.title}`} />
        <img src={product.images[0]} alt={product.title} className="h-20 w-20 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-ink">{product.title}</h2>
          <p className="mt-1 text-xs text-gray-500">{product.variants[0]?.sku}</p>
          <div className="mt-2 flex flex-wrap gap-2"><StatusBadge status={product.status} /><StockBadge product={product} /></div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onView}><Eye className="h-4 w-4" /> Xem</Button>
        <Button type="button" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /> Sửa</Button>
      </div>
    </article>
  );
}

function QuickActions({ onView, onEdit, onArchive }: { onView: () => void; onEdit: () => void; onArchive: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" className="admin-icon-button" onClick={onView} aria-label="Xem" title="Xem nhanh"><Eye className="h-4 w-4" /></button>
      <button type="button" className="admin-icon-button" onClick={onEdit} aria-label="Sửa" title="Sửa sản phẩm"><Pencil className="h-4 w-4" /></button>
      <button type="button" className="admin-icon-button" aria-label="Nhân bản" title="Nhân bản sản phẩm"><Copy className="h-4 w-4" /></button>
      <button type="button" className="admin-icon-button" onClick={onArchive} aria-label="Lưu trữ" title="Ẩn hoặc lưu trữ"><Archive className="h-4 w-4" /></button>
      <button type="button" className="admin-icon-button" aria-label="Thêm" title="Thao tác khác"><MoreHorizontal className="h-4 w-4" /></button>
    </div>
  );
}

function ProductQuickViewDrawer({ product, onClose, onEdit }: { product: Product | null; onClose: () => void; onEdit: (product: Product) => void }) {
  return (
    <AdminDrawer open={Boolean(product)} title="Xem nhanh sản phẩm" description="Tổng quan bán hàng, tồn kho và SEO." onClose={onClose} width="max-w-2xl" footer={product ? <div className="flex justify-end gap-3"><Button variant="secondary" onClick={onClose}>Đóng</Button><Button onClick={() => onEdit(product)}>Sửa sản phẩm</Button></div> : null}>
      {product ? (
        <div className="grid gap-5">
          <img src={product.images[0]} alt={product.title} className="aspect-[4/3] w-full rounded-2xl object-cover" />
          <div><StatusBadge status={product.status} /><h2 className="mt-3 font-display text-4xl font-semibold text-ink">{product.title}</h2><p className="mt-2 text-gray-600">{product.shortDescription}</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Giá" value={formatPriceRange(product)} />
            <Info label="Tồn kho" value={`${stockCount(product)} khả dụng`} />
            <Info label="Danh mục" value={product.categorySlugs.join(", ")} />
            <Info label="Bộ sưu tập" value={product.collectionSlugs.join(", ")} />
          </div>
        <div className="rounded-sm border border-silver-200 bg-white/5 p-4"><p className="text-xs font-semibold uppercase tracking-[.14em] text-gray-500">SEO preview</p><h3 className="mt-2 font-semibold text-claret">{product.seoTitle}</h3><p className="mt-1 text-sm text-gray-600">{product.seoDescription}</p></div>
        </div>
      ) : null}
    </AdminDrawer>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-sm border border-silver-200 bg-white/5 p-4"><p className="text-xs text-gray-500">{label}</p><b className="mt-1 block text-foreground">{value}</b></div>;
}

function StatusBadge({ status }: { status: string }) {
  return <Badge className="border-silver-200 bg-white text-ink">{status}</Badge>;
}

function StockBadge({ product }: { product: Product }) {
  const stock = stockCount(product);
  return <Badge className={stock <= 0 ? "border-gray-200 text-gray-500" : stock <= 3 ? "border-[#d8c7a3] bg-[#efe4c8] text-ink" : "border-sky-200 text-sky-700"}>{stock <= 0 ? "Hết hàng" : stock <= 3 ? "Sắp hết" : `${stock} còn`}</Badge>;
}

function ProductBadges({ product }: { product: Product }) {
  const badges = [product.bestSeller ? "Bán chạy" : "", product.newArrival ? "Mới" : "", product.variants.some((variant) => variant.compareAtPrice) ? "Sale" : "", stockCount(product) <= 3 ? "Sắp hết" : ""].filter(Boolean);
  return <div className="flex flex-wrap gap-1">{badges.map((badge) => <Badge key={badge} className="border-silver-200 bg-pearl text-ink">{badge}</Badge>)}</div>;
}

function minPrice(product: Product) {
  const prices = product.variants.map((variant) => variant.price);
  return prices.length ? Math.min(...prices) : 0;
}

function stockCount(product: Product) {
  return product.variants.reduce((sum, variant) => sum + variant.inventory.quantityAvailable - variant.inventory.quantityReserved, 0);
}

function formatPriceRange(product: Product) {
  const prices = product.variants.map((variant) => variant.price);
  if (!prices.length) return "Chưa có giá";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
}
