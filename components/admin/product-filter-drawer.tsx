"use client";

import { Filter } from "lucide-react";
import { useState } from "react";
import type { Category, Collection } from "@/types/commerce";
import { AdminDrawer } from "@/components/admin/shared/admin-overlays";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { FilterChip } from "@/components/filter/filter-components";

export type AdminProductFilters = {
  statuses: string[];
  categories: string[];
  collections: string[];
  stock: string[];
  tags: string[];
  minPrice: string;
  maxPrice: string;
};

const statusOptions = [["active", "Active"], ["inactive", "Inactive"], ["draft", "Draft"], ["archived", "Archived"]];
const stockOptions = [["in-stock", "Còn hàng"], ["out-stock", "Hết hàng"], ["low-stock", "Sắp hết hàng"], ["reserved", "Có hàng reserve"]];
const tagOptions = [["new", "New"], ["best", "Best seller"], ["sale", "Sale"], ["featured", "Featured"]];

export function AdminProductFilterDrawer({ categories, collections, filters, onChange }: { categories: Category[]; collections: Collection[]; filters: AdminProductFilters; onChange: (filters: AdminProductFilters) => void }) {
  const [open, setOpen] = useState(false);
  const reset = () => onChange({ statuses: [], categories: [], collections: [], stock: [], tags: [], minPrice: "", maxPrice: "" });
  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}><Filter className="h-4 w-4" /> Bộ lọc</Button>
      <AdminDrawer
        open={open}
        title="Bộ lọc sản phẩm"
        description="Lọc nhanh theo trạng thái, danh mục, bộ sưu tập, tồn kho và tag hiển thị."
        onClose={() => setOpen(false)}
        width="max-w-2xl"
        footer={<div className="grid grid-cols-2 gap-3"><Button type="button" variant="secondary" onClick={reset}>Xóa lọc</Button><Button type="button" onClick={() => setOpen(false)}>Áp dụng lọc</Button></div>}
      >
        <div className="grid gap-6">
          <AdminFilterGroup title="Trạng thái sản phẩm" options={statusOptions} values={filters.statuses} onToggle={(value) => onChange({ ...filters, statuses: toggle(filters.statuses, value) })} />
          <AdminFilterGroup title="Danh mục" options={categories.map((category) => [category.slug, category.name])} values={filters.categories} onToggle={(value) => onChange({ ...filters, categories: toggle(filters.categories, value) })} />
          <AdminFilterGroup title="Bộ sưu tập" options={collections.map((collection) => [collection.slug, collection.name])} values={filters.collections} onToggle={(value) => onChange({ ...filters, collections: toggle(filters.collections, value) })} />
          <div className="grid gap-3">
            <h3 className="text-sm font-semibold text-ink">Khoảng giá</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" value={filters.minPrice} onChange={(event) => onChange({ ...filters, minPrice: event.target.value })} placeholder="Min price" />
              <Input type="number" value={filters.maxPrice} onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })} placeholder="Max price" />
            </div>
          </div>
          <AdminFilterGroup title="Tồn kho" options={stockOptions} values={filters.stock} onToggle={(value) => onChange({ ...filters, stock: toggle(filters.stock, value) })} />
          <AdminFilterGroup title="Tags / Badges" options={tagOptions} values={filters.tags} onToggle={(value) => onChange({ ...filters, tags: toggle(filters.tags, value) })} />
          <div className="grid gap-3">
            <h3 className="text-sm font-semibold text-ink">Ngày tạo / cập nhật</h3>
            <div className="grid grid-cols-2 gap-3"><Input type="date" /><Input type="date" /></div>
          </div>
        </div>
      </AdminDrawer>
    </>
  );
}

export function ActiveAdminFilters({ filters, categories, collections, onChange }: { filters: AdminProductFilters; categories: Category[]; collections: Collection[]; onChange: (filters: AdminProductFilters) => void }) {
  const chips = [
    ...filters.statuses.map((value) => ({ group: "statuses" as const, value, label: value })),
    ...filters.categories.map((value) => ({ group: "categories" as const, value, label: categories.find((item) => item.slug === value)?.name ?? value })),
    ...filters.collections.map((value) => ({ group: "collections" as const, value, label: collections.find((item) => item.slug === value)?.name ?? value })),
    ...filters.stock.map((value) => ({ group: "stock" as const, value, label: stockOptions.find(([id]) => id === value)?.[1] ?? value })),
    ...filters.tags.map((value) => ({ group: "tags" as const, value, label: tagOptions.find(([id]) => id === value)?.[1] ?? value })),
  ];
  if (!chips.length && !filters.minPrice && !filters.maxPrice) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {filters.minPrice || filters.maxPrice ? <FilterChip label={`${filters.minPrice || "0"} - ${filters.maxPrice || "∞"}`} onRemove={() => onChange({ ...filters, minPrice: "", maxPrice: "" })} /> : null}
      {chips.map((chip) => <FilterChip key={`${chip.group}-${chip.value}`} label={chip.label} onRemove={() => onChange({ ...filters, [chip.group]: filters[chip.group].filter((item) => item !== chip.value) })} />)}
    </div>
  );
}

function AdminFilterGroup({ title, options, values, onToggle }: { title: string; options: string[][]; values: string[]; onToggle: (value: string) => void }) {
  return (
    <section className="grid gap-3">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(([value, label]) => <button key={value} type="button" className={values.includes(value) ? "filter-option is-active" : "filter-option"} onClick={() => onToggle(value)}>{label}</button>)}
      </div>
    </section>
  );
}

function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}
