"use client";

import { CheckCircle, ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Collection, Product } from "@/types/commerce";
import { AdminDrawer, ConfirmDialog } from "@/components/admin/shared/admin-overlays";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/form";
import { ProductUpsertDrawer } from "@/components/admin/product-upsert-drawer";
import { ActiveAdminFilters, AdminProductFilterDrawer, type AdminProductFilters } from "@/components/admin/product-filter-drawer";
import { AdminDropdown } from "@/components/admin/admin-dropdown";
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
  const [statusTarget, setStatusTarget] = useState<Product | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, Product["status"]>>({});
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  function resetPage() {
    setPage(1);
  }

  function updateFilters(nextFilters: AdminProductFilters) {
    setFilters(nextFilters);
    resetPage();
  }

  function updateSort(nextSort: string) {
    setSort(nextSort);
    resetPage();
  }

  function updateItemsPerPage(nextItemsPerPage: string) {
    setItemsPerPage(nextItemsPerPage);
    resetPage();
  }

  const displayedProducts = useMemo(() => {
    return products.map((product) => statusOverrides[product.id] ? { ...product, status: statusOverrides[product.id] } : product);
  }, [products, statusOverrides]);

  const filtered = useMemo(() => {
    return displayedProducts
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
  }, [displayedProducts, query, filters, sort]);

  const perPage = Number(itemsPerPage);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedProducts = filtered.slice((page - 1) * perPage, page * perPage);

  const allVisibleSelected = paginatedProducts.length > 0 && paginatedProducts.every((product) => selected.includes(product.id));

  function toggleSelected(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleAllOnPage() {
    if (allVisibleSelected) {
      setSelected((current) => current.filter((id) => !paginatedProducts.some((p) => p.id === id)));
    } else {
      setSelected((current) => Array.from(new Set([...current, ...paginatedProducts.map((p) => p.id)])));
    }
  }

  function confirmStatusToggle() {
    if (!statusTarget) return;
    setStatusOverrides((current) => ({
      ...current,
      [statusTarget.id]: statusTarget.status === "active" ? "inactive" : "active",
    }));
    setStatusTarget(null);
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
          <AdminProductFilterDrawer categories={categories} collections={collections} filters={filters} onChange={updateFilters} />
          <Button type="button" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Thêm sản phẩm</Button>
        </div>
      </div>

      <section className="admin-panel">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <Input className="!pl-12" value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder="Tìm theo tên sản phẩm hoặc SKU..." />
          </div>
          <AdminDropdown
            ariaLabel="Sắp xếp sản phẩm"
            value={sort}
            onChange={updateSort}
            options={[
              { value: "updated", label: "Cập nhật mới" },
              { value: "price-asc", label: "Giá thấp đến cao" },
              { value: "price-desc", label: "Giá cao đến thấp" },
              { value: "stock", label: "Sắp hết hàng" },
            ]}
          />
          <Button type="button" variant="secondary" onClick={() => updateFilters({ statuses: [], categories: [], collections: [], stock: [], tags: [], minPrice: "", maxPrice: "" })}>Xóa lọc</Button>
        </div>
        <ActiveAdminFilters filters={filters} categories={categories} collections={collections} onChange={updateFilters} />
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
                <th className="p-4"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAllOnPage} aria-label="Chọn tất cả" /></th>
                <th>Sản phẩm</th>
                <th>Giá gốc</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => <ProductRow key={product.id} product={product} selected={selected.includes(product.id)} onSelect={() => toggleSelected(product.id)} onView={() => setViewing(product)} onEdit={() => setEditing(product)} onToggleStatus={() => setStatusTarget(product)} />)}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 lg:hidden">
          {paginatedProducts.map((product) => <ProductCardRow key={product.id} product={product} selected={selected.includes(product.id)} onSelect={() => toggleSelected(product.id)} onView={() => setViewing(product)} onEdit={() => setEditing(product)} onToggleStatus={() => setStatusTarget(product)} />)}
        </div>
        {totalPages > 1 || filtered.length > 10 ? (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-silver-200 p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Hiển thị {(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} trên tổng số {filtered.length} sản phẩm
              </span>
              <select
                className="h-8 rounded-sm border border-silver-200 bg-white px-2 text-sm outline-none hover:border-cta focus:border-cta focus:ring-2 focus:ring-cta/20"
                value={itemsPerPage}
                onChange={(event) => updateItemsPerPage(event.target.value)}
                aria-label="Số lượng mỗi trang"
              >
                <option value="10">10 / trang</option>
                <option value="20">20 / trang</option>
                <option value="50">50 / trang</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" /> Trước
              </Button>
              <span className="text-sm font-medium text-ink">
                {page} / {totalPages}
              </span>
              <Button type="button" variant="secondary" size="sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Sau <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <ProductUpsertDrawer key={createOpen ? "create-open" : "create-closed"} open={createOpen} categories={categories} collections={collections} onClose={() => setCreateOpen(false)} />
      <ProductUpsertDrawer key={editing?.id ?? "edit-closed"} open={Boolean(editing)} product={editing} categories={categories} collections={collections} onClose={() => setEditing(null)} />
      <ProductQuickViewDrawer product={viewing} onClose={() => setViewing(null)} onEdit={(product) => { setViewing(null); setEditing(product); }} />
      <ConfirmDialog open={confirmOpen} description="Thao tác này đang ở chế độ UI preview. Khi nối write API, hệ thống sẽ cập nhật các sản phẩm đã chọn sau bước xác nhận." onConfirm={() => setConfirmOpen(false)} onClose={() => setConfirmOpen(false)} />
      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.status === "active" ? "Inactive sản phẩm?" : "Active sản phẩm?"}
        description={statusTarget?.status === "active"
          ? `Sản phẩm "${statusTarget.title}" sẽ được xoá mềm bằng cách chuyển sang trạng thái inactive. Sản phẩm không bị xoá cứng khỏi hệ thống.`
          : `Sản phẩm "${statusTarget?.title ?? ""}" sẽ được bật lại về trạng thái active.`}
        confirmLabel={statusTarget?.status === "active" ? "Chuyển inactive" : "Chuyển active"}
        onConfirm={confirmStatusToggle}
        onClose={() => setStatusTarget(null)}
      />
    </div>
  );
}

function ProductRow({ product, selected, onSelect, onView, onEdit, onToggleStatus }: { product: Product & { updatedAt?: string | Date }; selected: boolean; onSelect: () => void; onView: () => void; onEdit: () => void; onToggleStatus: () => void }) {
  return (
    <tr className="border-t border-silver-200 align-middle hover:bg-sky-50/45">
      <td className="p-4"><input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Chọn ${product.title}`} /></td>
      <td className="py-4">
        <div className="flex items-center gap-3">
          <img src={product.images[0]} alt={product.title} className="h-14 w-14 rounded-2xl object-cover" />
          <div><b className="text-foreground">{product.title}</b><p className="text-xs text-gray-500">{product.variants[0]?.sku ?? "Chưa có SKU"}</p></div>
        </div>
      </td>
      <td className="font-semibold text-danger">{formatOriginalPriceRange(product)}</td>
      <td className="font-semibold text-cta">{formatPriceRange(product)}</td>
      <td><StockBadge product={product} /></td>
      <td><StatusBadge status={product.status} /></td>
      <td>{formatDateTime(product.updatedAt)}</td>
      <td><QuickActions status={product.status} onView={onView} onEdit={onEdit} onToggleStatus={onToggleStatus} /></td>
    </tr>
  );
}

function ProductCardRow({ product, selected, onSelect, onView, onEdit, onToggleStatus }: { product: Product; selected: boolean; onSelect: () => void; onView: () => void; onEdit: () => void; onToggleStatus: () => void }) {
  return (
    <article className="rounded-2xl border border-silver-200 bg-white p-4">
      <div className="flex gap-3">
        <input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Chọn ${product.title}`} />
        <img src={product.images[0]} alt={product.title} className="h-20 w-20 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-ink">{product.title}</h2>
          <p className="mt-1 text-xs text-gray-500">{product.variants[0]?.sku}</p>
          <p className="mt-2 text-sm font-semibold text-danger">Gốc: {formatOriginalPriceRange(product)}</p>
          <p className="text-sm font-semibold text-cta">Giá: {formatPriceRange(product)}</p>
          <div className="mt-2 flex flex-wrap gap-2"><StatusBadge status={product.status} /><StockBadge product={product} /></div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onView}><Eye className="h-4 w-4" /> Xem</Button>
        <Button type="button" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /> Sửa</Button>
        <Button type="button" variant="secondary" size="sm" onClick={onToggleStatus}>
          {product.status === "active" ? <Trash2 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          {product.status === "active" ? "Inactive" : "Active"}
        </Button>
      </div>
    </article>
  );
}

function QuickActions({ status, onView, onEdit, onToggleStatus }: { status: Product["status"]; onView: () => void; onEdit: () => void; onToggleStatus: () => void }) {
  const isActive = status === "active";

  return (
    <div className="flex items-center gap-1">
      <button type="button" className="admin-icon-button" onClick={onView} aria-label="Xem" title="Xem nhanh"><Eye className="h-4 w-4" /></button>
      <button type="button" className="admin-icon-button" onClick={onEdit} aria-label="Sửa" title="Sửa sản phẩm"><Pencil className="h-4 w-4" /></button>
      <button type="button" className="admin-icon-button" onClick={onToggleStatus} aria-label={isActive ? "Inactive sản phẩm" : "Active sản phẩm"} title={isActive ? "Xoá mềm: chuyển inactive" : "Bật lại active"}>
        {isActive ? <Trash2 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ProductQuickViewDrawer({ product, onClose, onEdit }: { product: Product | null; onClose: () => void; onEdit: (product: Product) => void }) {
  const images = product ? (product.images.length ? product.images : [product.ogImage].filter(Boolean)) : [];

  return (
    <AdminDrawer open={Boolean(product)} title="Xem nhanh sản phẩm" description="Preview storefront, biến thể, giá và tồn kho." onClose={onClose} width="max-w-6xl" footer={product ? <div className="flex justify-end gap-3"><Button variant="secondary" onClick={onClose}>Đóng</Button><Button onClick={() => onEdit(product)}>Sửa sản phẩm</Button></div> : null}>
      {product ? (
        <div className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
            <div className="grid gap-3">
              {images[0] ? (
                <img src={images[0]} alt={product.title} className="aspect-square w-full rounded-sm border border-line object-cover" />
              ) : (
                <div className="grid aspect-square w-full place-items-center rounded-sm border border-line bg-ivory-soft text-sm text-slate-muted">Chưa có ảnh sản phẩm</div>
              )}
              {images.length > 1 ? (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <img key={`${image}-${index}`} src={image} alt={`${product.title} ${index + 1}`} className="h-28 w-28 shrink-0 rounded-sm border border-line object-cover" />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid content-start gap-5">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={product.status} />
                <Badge className="border-cta/30 bg-cta-soft text-navy">{product.material}</Badge>
                {product.giftWrap ? <Badge className="border-success/20 bg-success/10 text-success">Gói quà</Badge> : null}
                {product.bestSeller ? <Badge className="border-warning/20 bg-warning/10 text-warning">Bán chạy</Badge> : null}
              </div>
              <div>
                <h2 className="font-display text-5xl font-semibold leading-none text-ink">{product.title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-muted">{product.shortDescription}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-muted">
                  {product.material} · Bảo hành {product.warrantyMonths} tháng {product.giftWrap ? "· Gói quà tinh tế" : ""}
                </p>
                <p className="mt-3 text-2xl font-bold text-cta">{formatPriceRange(product)}</p>
              </div>
              <div className="grid gap-3 rounded-sm border border-line bg-pearl p-4 sm:grid-cols-2">
                <InfoInline label="Chất liệu" value={product.material} />
                <InfoInline label="Trọng lượng" value={product.weight || "Chưa cập nhật"} />
                <InfoInline label="Đá" value={product.stone ?? "Không"} />
                <InfoInline label="Bảo hành" value={`${product.warrantyMonths} tháng`} />
              </div>
              <section className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-ink">Biến thể & giá</h3>
                  <span className="text-xs font-semibold text-slate-muted">{product.variants.length} biến thể</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <span key={variant.id} className="rounded-sm border border-line bg-pearl px-3 py-2 text-sm font-medium text-slate">
                      {variant.title}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Giá" value={formatPriceRange(product)} />
            <Info label="Tồn kho" value={`${stockCount(product)} khả dụng`} />
            <Info label="Danh mục" value={product.categorySlugs.join(", ") || "Chưa gắn"} />
            <Info label="Bộ sưu tập" value={product.collectionSlugs.join(", ") || "Chưa gắn"} />
          </div>

          <section className="overflow-hidden rounded-sm border border-line bg-pearl">
            <div className="flex items-center justify-between border-b border-line p-4">
              <h3 className="text-sm font-bold uppercase tracking-[.16em] text-slate">Bảng biến thể</h3>
              <span className="text-sm text-slate-muted">Giá, SKU và tồn kho khả dụng</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-ivory-soft text-slate-muted">
                  <tr>
                    <th className="p-3">Biến thể</th>
                    <th>SKU</th>
                    <th>Giá gốc</th>
                    <th>Giá</th>
                    <th>Giảm giá</th>
                    <th>Khả dụng</th>
                    <th>Reserve</th>
                    <th>Đã bán</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className={variantAvailable(variant) <= 0 ? "border-t border-line bg-danger/5" : "border-t border-line"}>
                      <td className={variantAvailable(variant) <= 0 ? "p-3 font-semibold text-danger" : "p-3 font-semibold text-ink"}>
                        {variant.title}
                        {variantAvailable(variant) <= 0 ? <span className="ml-2 rounded-sm border border-danger/25 bg-danger/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-danger">Hết hàng</span> : null}
                      </td>
                      <td>{variant.sku}</td>
                      <td className="font-semibold text-danger">{formatCurrency(variantOriginalPrice(variant))}</td>
                      <td className="font-semibold text-cta">{formatCurrency(variant.price)}</td>
                      <td>{variantDiscount(variant) > 0 ? formatCurrency(variantDiscount(variant)) : "—"}</td>
                      <td className={variantAvailable(variant) <= 0 ? "font-semibold text-danger" : undefined}>{variantAvailable(variant) <= 0 ? "Hết hàng" : variantAvailable(variant)}</td>
                      <td>{variant.inventory.quantityReserved}</td>
                      <td>{variant.inventory.quantitySold}</td>
                      <td>{variantAvailable(variant) <= 0 ? "Hết hàng" : variant.active ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="rounded-sm border border-silver-200 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-gray-500">SEO preview</p>
            <h3 className="mt-2 font-semibold text-claret">{product.seoTitle}</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">{product.seoDescription}</p>
          </div>
        </div>
      ) : null}
    </AdminDrawer>
  );
}

function InfoInline({ label, value }: { label: string; value: string }) {
  return <p className="text-sm text-slate-muted">{label}: <b className="text-ink">{value}</b></p>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-sm border border-silver-200 bg-white/5 p-4"><p className="text-xs text-gray-500">{label}</p><b className="mt-1 block text-foreground">{value}</b></div>;
}

function StatusBadge({ status }: { status: string }) {
  const className = status === "active"
    ? "border-success/25 bg-success/10 text-success"
    : status === "inactive"
      ? "border-danger/25 bg-danger/10 text-danger"
      : "border-silver-200 bg-white text-ink";

  return <Badge className={className}>{status}</Badge>;
}

function StockBadge({ product }: { product: Product }) {
  const stock = stockCount(product);
  return <Badge className={stock <= 0 ? "border-gray-200 text-gray-500" : stock <= 3 ? "border-[#d8c7a3] bg-[#efe4c8] text-ink" : "border-sky-200 text-sky-700"}>{stock <= 0 ? "Hết hàng" : stock <= 3 ? "Sắp hết" : `${stock} còn`}</Badge>;
}

function minPrice(product: Product) {
  const prices = product.variants.map((variant) => variant.price);
  return prices.length ? Math.min(...prices) : 0;
}

function stockCount(product: Product) {
  return product.variants.reduce((sum, variant) => sum + variant.inventory.quantityAvailable - variant.inventory.quantityReserved, 0);
}

function variantAvailable(variant: Product["variants"][number]) {
  return Math.max(variant.inventory.quantityAvailable - variant.inventory.quantityReserved, 0);
}

function formatPriceRange(product: Product) {
  const prices = product.variants.map((variant) => variant.price);
  if (!prices.length) return "Chưa có giá";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

function formatOriginalPriceRange(product: Product) {
  const prices = product.variants.map(variantOriginalPrice);
  if (!prices.length) return "Chưa có giá";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

function variantOriginalPrice(variant: Product["variants"][number]) {
  return variant.compareAtPrice && variant.compareAtPrice > variant.price ? variant.compareAtPrice : variant.price;
}

function variantDiscount(variant: Product["variants"][number]) {
  return Math.max(variantOriginalPrice(variant) - variant.price, 0);
}

function formatDateTime(dateInput?: string | Date) {
  const date = dateInput ? new Date(dateInput) : new Date();
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  return `${d}/${m}/${y} ${hh}:${mm}`;
}
