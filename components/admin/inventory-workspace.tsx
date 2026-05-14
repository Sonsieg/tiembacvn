"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/types/commerce";
import { Input } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type InventoryRow = { product: Product; variant: ProductVariant };

const statusOptions = [
  ["in-stock", "Còn hàng"],
  ["low-stock", "Sắp hết"],
  ["out-stock", "Hết hàng"],
  ["reserved", "Đang reserve"],
];

export function InventoryWorkspace({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const variants = useMemo(() => products.flatMap((product) => product.variants.map((variant) => ({ product, variant }))), [products]);
  const totals = variants.reduce((summary, { product, variant }) => {
    const sellable = variant.inventory.quantityAvailable - variant.inventory.quantityReserved;
    return {
      sellable: summary.sellable + Math.max(sellable, 0),
      reserved: summary.reserved + variant.inventory.quantityReserved,
      low: summary.low + Number(sellable > 0 && sellable <= variant.inventory.lowStockThreshold),
      out: summary.out + Number(sellable <= 0 || product.status !== "active" || !variant.active),
    };
  }, { sellable: 0, reserved: 0, low: 0, out: 0 });
  const visible = variants.filter(({ product, variant }) => {
    const sellable = variant.inventory.quantityAvailable - variant.inventory.quantityReserved;
    const textMatch = `${product.title} ${variant.title} ${variant.sku}`.toLowerCase().includes(query.toLowerCase());
    const statusMatch = !statuses.length || statuses.some((status) => {
      if (status === "in-stock") return sellable > variant.inventory.lowStockThreshold;
      if (status === "low-stock") return sellable > 0 && sellable <= variant.inventory.lowStockThreshold;
      if (status === "out-stock") return sellable <= 0;
      if (status === "reserved") return variant.inventory.quantityReserved > 0;
      return true;
    });
    return textMatch && statusMatch;
  });
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = visible.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="grid gap-5">
      <div>
        <p className="eyebrow">Inventory</p>
        <h1 className="admin-display-title">Tồn kho sản phẩm</h1>
        <p className="mt-2 text-sm text-gray-500">Tìm nhanh theo sản phẩm, biến thể hoặc SKU. Chọn nhiều trạng thái bằng chip để lọc tồn kho.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Khả dụng</p><b className="mt-2 block text-2xl text-success">{totals.sellable}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Reserve</p><b className="mt-2 block text-2xl text-warning">{totals.reserved}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Sắp hết</p><b className="mt-2 block text-2xl text-cta">{totals.low}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Hết / inactive</p><b className="mt-2 block text-2xl text-danger">{totals.out}</b></section>
      </div>
      <section className="admin-panel">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <Input className="!pl-12" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm sản phẩm, size, SKU..." />
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(([value, label]) => (
              <button key={value} type="button" className={statuses.includes(value) ? "filter-option is-active" : "filter-option"} onClick={() => { setStatuses((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]); setPage(1); }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="admin-table-card overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead><tr><th className="p-4">Sản phẩm</th><th>Biến thể</th><th>SKU</th><th>Khả dụng</th><th>Reserve</th><th>Đã bán</th><th>Trạng thái</th></tr></thead>
          <tbody>{paginated.map(({ product, variant }) => <InventoryLine key={variant.id} product={product} variant={variant} />)}</tbody>
        </table>
        {!visible.length ? <div className="border-t border-line p-8 text-center text-sm text-slate-muted">Không có biến thể phù hợp.</div> : null}
        {visible.length > pageSize ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4">
            <span className="text-sm text-slate-muted">Hiển thị {(safePage - 1) * pageSize + 1} - {Math.min(safePage * pageSize, visible.length)} / {visible.length}</span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft className="h-4 w-4" /> Trước</Button>
              <span className="text-sm font-medium text-ink">{safePage} / {totalPages}</span>
              <Button type="button" variant="secondary" size="sm" disabled={safePage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Sau <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function InventoryLine({ product, variant }: InventoryRow) {
  const sellable = variant.inventory.quantityAvailable - variant.inventory.quantityReserved;
  const unavailable = product.status !== "active" || !variant.active;
  const state = unavailable ? "Inactive" : sellable <= 0 ? "Hết hàng" : sellable <= variant.inventory.lowStockThreshold ? "Sắp hết" : "Ổn định";
  const badgeClass = unavailable || sellable <= 0
    ? "border-danger/25 bg-danger/10 text-danger"
    : sellable <= variant.inventory.lowStockThreshold
      ? "border-warning/25 bg-warning/10 text-warning"
      : "border-success/25 bg-success/10 text-success";

  return (
    <tr className={unavailable || sellable <= 0 ? "border-t border-silver-200 bg-danger/5 hover:bg-danger/10" : "border-t border-silver-200 hover:bg-white/5"}>
      <td className={unavailable || sellable <= 0 ? "p-4 font-semibold text-danger" : "p-4 font-semibold text-foreground"}>{product.title}</td>
      <td className="font-medium">{variant.title}</td>
      <td className="text-gray-400">{variant.sku}</td>
      <td className={sellable <= 0 ? "font-semibold text-danger" : "font-semibold text-ink"}>{Math.max(sellable, 0)}</td>
      <td>{variant.inventory.quantityReserved}</td>
      <td>{variant.inventory.quantitySold}</td>
      <td><Badge className={badgeClass}>{state}</Badge></td>
    </tr>
  );
}
