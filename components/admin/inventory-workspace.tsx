"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/types/commerce";
import { Input } from "@/components/ui/form";

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
  const variants = useMemo(() => products.flatMap((product) => product.variants.map((variant) => ({ product, variant }))), [products]);
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

  return (
    <div className="grid gap-5">
      <div>
        <p className="eyebrow">Inventory</p>
        <h1 className="admin-display-title">Tồn kho sản phẩm</h1>
        <p className="mt-2 text-sm text-gray-500">Tìm nhanh theo sản phẩm, biến thể hoặc SKU. Chọn nhiều trạng thái bằng chip để lọc tồn kho.</p>
      </div>
      <section className="admin-panel">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input className="pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm sản phẩm, size, SKU..." />
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(([value, label]) => (
              <button key={value} type="button" className={statuses.includes(value) ? "filter-option is-active" : "filter-option"} onClick={() => setStatuses((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="admin-table-card overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead><tr><th className="p-4">Sản phẩm</th><th>Biến thể</th><th>SKU</th><th>Available</th><th>Reserved</th><th>Sold</th><th>Trạng thái</th></tr></thead>
          <tbody>{visible.map(({ product, variant }) => <InventoryLine key={variant.id} product={product} variant={variant} />)}</tbody>
        </table>
      </section>
    </div>
  );
}

function InventoryLine({ product, variant }: InventoryRow) {
  const sellable = variant.inventory.quantityAvailable - variant.inventory.quantityReserved;
  const state = sellable <= 0 ? "Hết hàng" : sellable <= variant.inventory.lowStockThreshold ? "Sắp hết" : "Ổn định";
  return (
    <tr className="border-t border-silver-200 hover:bg-white/5">
      <td className="p-4 font-semibold text-foreground">{product.title}</td>
      <td>{variant.title}</td>
      <td className="text-gray-400">{variant.sku}</td>
      <td>{variant.inventory.quantityAvailable}</td>
      <td>{variant.inventory.quantityReserved}</td>
      <td>{variant.inventory.quantitySold}</td>
      <td><span className={sellable <= variant.inventory.lowStockThreshold ? "text-claret" : "text-gray-400"}>{state}</span></td>
    </tr>
  );
}
