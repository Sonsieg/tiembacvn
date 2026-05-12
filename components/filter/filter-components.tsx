"use client";

import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Category } from "@/types/commerce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { formatCurrency } from "@/lib/utils/format";
import { useFilterStore } from "@/store/filter.store";

export const pricePresets = [
  { label: "Dưới 300K", range: [0, 300000] as [number, number] },
  { label: "300K–500K", range: [300000, 500000] as [number, number] },
  { label: "500K–800K", range: [500000, 800000] as [number, number] },
  { label: "Trên 800K", range: [800000, 2000000] as [number, number] },
];

const materialOptions = [
  "Bạc S925",
  "Bạc Ý",
  "Bạc xi vàng trắng",
  "Bạc đính đá",
];
const sizeOptions = [
  "Size 5",
  "Size 6",
  "Size 7",
  "Size 8",
  "Size 9",
  "Freesize",
];
const styleOptions = [
  "Tối giản",
  "Thanh lịch",
  "Sang trọng",
  "Dễ thương",
  "Vintage",
];
const occasionOptions = [
  "Sinh nhật",
  "Kỷ niệm",
  "Valentine",
  "Quà cho nàng",
  "Quà cho mẹ",
  "Dùng hằng ngày",
];
const statusOptions = ["Còn hàng", "Đang sale", "Bán chạy", "Hàng mới"];

const sortOptions = [
  ["newest", "Mới nhất"],
  ["price-asc", "Giá thấp đến cao"],
  ["price-desc", "Giá cao đến thấp"],
  ["best", "Bán chạy"],
  ["rating", "Đánh giá cao"],
  ["sale", "Đang sale"],
];

export function SortSelect() {
  const sort = useFilterStore((state) => state.sort);
  const setSort = useFilterStore((state) => state.setSort);
  const [open, setOpen] = useState(false);
  const label =
    sortOptions.find(([value]) => value === sort)?.[1] ?? "Mới nhất";
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Sắp xếp sản phẩm"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full min-w-52 items-center justify-between gap-3 rounded-sm border border-line bg-pearl px-4 text-left text-sm font-medium text-slate outline-none transition hover:border-cta focus:border-cta focus:ring-2 focus:ring-cta/20"
      >
        <span>{label}</span>
        <ChevronDown className="h-4 w-4 text-slate-muted" />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-sm border border-line bg-pearl p-1 shadow-premium">
          {sortOptions.map(([value, optionLabel]) => (
            <button
              key={value}
              type="button"
              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-slate hover:bg-cta-soft/45"
              onClick={() => {
                setSort(value);
                setOpen(false);
              }}
            >
              {optionLabel}
              {value === sort ? <Check className="h-4 w-4 text-cta" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-sm border border-cta/35 bg-cta-soft px-3 text-[10px] font-bold uppercase tracking-[.12em] text-navy">
      {label}
      {onRemove ? (
        <button
          type="button"
          aria-label={`Bỏ lọc ${label}`}
          onClick={onRemove}
          className="text-slate-muted hover:text-navy"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  );
}

export function ActiveFiltersBar({ categories }: { categories: Category[] }) {
  const state = useFilterStore();
  const categoryName = (slug: string) =>
    categories.find((category) => category.slug === slug)?.name ?? slug;
  const active: {
    group:
      | "categories"
      | "materials"
      | "sizes"
      | "styles"
      | "occasions"
      | "statuses";
    value: string;
    label: string;
  }[] = [
    ...state.categories.map((value) => ({
      group: "categories" as const,
      value,
      label: categoryName(value),
    })),
    ...state.materials.map((value) => ({
      group: "materials" as const,
      value,
      label: value,
    })),
    ...state.sizes.map((value) => ({
      group: "sizes" as const,
      value,
      label: value,
    })),
    ...state.styles.map((value) => ({
      group: "styles" as const,
      value,
      label: value,
    })),
    ...state.occasions.map((value) => ({
      group: "occasions" as const,
      value,
      label: value,
    })),
    ...state.statuses.map((value) => ({
      group: "statuses" as const,
      value,
      label: value,
    })),
  ];
  const hasPrice = state.priceRange[0] !== 0 || state.priceRange[1] !== 2000000;

  if (!active.length && !hasPrice) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {hasPrice ? (
        <FilterChip
          label={`${formatCurrency(state.priceRange[0])} - ${formatCurrency(state.priceRange[1])}`}
          onRemove={() => state.setPriceRange([0, 2000000])}
        />
      ) : null}
      {active.map((item) => (
        <FilterChip
          key={`${item.group}-${item.value}`}
          label={item.label}
          onRemove={() => state.removeFilter(item.group, item.value)}
        />
      ))}
      <button
        type="button"
        onClick={state.resetFilters}
        className="h-9 shrink-0 rounded-sm border border-line bg-pearl px-3 text-xs font-semibold text-slate-muted hover:border-cta hover:text-navy"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}

export function FilterSidebar({ categories }: { categories: Category[] }) {
  return (
    <aside className="sticky top-24 hidden rounded-sm border border-line bg-pearl p-5 shadow-soft lg:block">
      <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[.2em] text-slate">
          Bộ lọc
        </h2>
        <SlidersHorizontal className="h-4 w-4 text-cta" />
      </div>
      <FilterPanel categories={categories} />
    </aside>
  );
}

export function FilterDrawer({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  return (
    <div className="lg:hidden">
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        <SlidersHorizontal className="h-4 w-4" /> Bộ lọc
      </Button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 bg-navy/45 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              className="absolute inset-x-0 bottom-0 grid max-h-[92svh] grid-rows-[auto_1fr_auto] rounded-t-[1.25rem] border border-line bg-ivory shadow-premium"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <header className="flex items-center justify-between border-b border-line bg-pearl p-5">
                <h2 className="font-display text-3xl font-semibold text-navy">
                  Bộ lọc sản phẩm
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-sm border border-line bg-pearl text-slate hover:border-cta"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>
              <div className="overflow-y-auto p-5">
                <FilterPanel categories={categories} />
              </div>
              <footer className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-line bg-pearl/95 p-4 backdrop-blur">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetFilters}
                >
                  Xóa lọc
                </Button>
                <Button type="button" onClick={() => setOpen(false)}>
                  Áp dụng
                </Button>
              </footer>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FilterPanel({ categories }: { categories: Category[] }) {
  const state = useFilterStore();
  return (
    <div className="grid gap-6">
      <CheckboxGroupFilter
        title="Danh mục"
        options={categories.map((category) => ({
          label: category.name,
          value: category.slug,
        }))}
        values={state.categories}
        onToggle={state.toggleCategory}
      />
      <PriceRangeFilter />
      <MultiSelectDropdownFilter
        title="Chất liệu"
        options={materialOptions}
        values={state.materials}
        onToggle={state.toggleMaterial}
      />
      <MultiSelectDropdownFilter
        title="Size"
        options={sizeOptions}
        values={state.sizes}
        onToggle={state.toggleSize}
      />
      <MultiSelectDropdownFilter
        title="Phong cách"
        options={styleOptions}
        values={state.styles}
        onToggle={state.toggleStyle}
      />
      <MultiSelectDropdownFilter
        title="Dịp tặng"
        options={occasionOptions}
        values={state.occasions}
        onToggle={state.toggleOccasion}
      />
      <MultiSelectDropdownFilter
        title="Trạng thái"
        options={statusOptions}
        values={state.statuses}
        onToggle={state.toggleStatus}
      />
    </div>
  );
}

export function PriceRangeFilter() {
  const priceRange = useFilterStore((state) => state.priceRange);
  const setPriceRange = useFilterStore((state) => state.setPriceRange);
  const [open, setOpen] = useState(false);
  const label =
    priceRange[0] === 0 && priceRange[1] === 2000000
      ? "Chọn khoảng giá"
      : `${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`;
  return (
    <section className="relative grid gap-3">
      <h3 className="text-[11px] font-bold uppercase tracking-[.16em] text-slate-muted">
        Khoảng giá
      </h3>
      <button
        type="button"
        className="flex h-11 items-center justify-between rounded-sm border border-line bg-pearl px-4 text-left text-sm font-semibold text-slate hover:border-cta"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{label}</span>
        <ChevronDown className="h-4 w-4 text-slate-muted" />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 grid gap-3 rounded-sm border border-line bg-pearl p-3 shadow-premium">
          <div className="grid grid-cols-2 gap-2">
            {pricePresets.map((preset) => {
              const active =
                priceRange[0] === preset.range[0] &&
                priceRange[1] === preset.range[1];
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPriceRange(preset.range)}
                  className={
                    active
                      ? "filter-option is-active justify-center"
                      : "filter-option justify-center"
                  }
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(event) =>
                setPriceRange([Number(event.target.value), priceRange[1]])
              }
              aria-label="Giá thấp nhất"
              placeholder="Từ"
            />
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(event) =>
                setPriceRange([priceRange[0], Number(event.target.value)])
              }
              aria-label="Giá cao nhất"
              placeholder="Đến"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function MultiSelectDropdownFilter({
  title,
  options,
  values,
  onToggle,
}: {
  title: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = values.length
    ? `${values.length} đã chọn`
    : `Chọn ${title.toLowerCase()}`;
  return (
    <section className="relative grid gap-3">
      <h3 className="text-[11px] font-bold uppercase tracking-[.16em] text-slate-muted">
        {title}
      </h3>
      <button
        type="button"
        className="flex h-11 items-center justify-between rounded-sm border border-line bg-pearl px-4 text-left text-sm font-semibold text-slate hover:border-cta"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{label}</span>
        <ChevronDown className="h-4 w-4 text-slate-muted" />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 grid max-h-72 gap-1 overflow-y-auto rounded-sm border border-line bg-pearl p-2 shadow-premium">
          {options.map((option) => {
            const active = values.includes(option);
            return (
              <button
                key={option}
                type="button"
                className="flex items-center justify-between rounded-sm px-3 py-2 text-sm font-semibold text-slate hover:bg-cta-soft/45"
                onClick={() => onToggle(option)}
              >
                <span>{option}</span>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-[4px] border ${active ? "border-cta bg-cta text-navy" : "border-silver text-transparent"}`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export function CheckboxGroupFilter({
  title,
  options,
  values,
  onToggle,
}: {
  title: string;
  options: string[] | { label: string; value: string }[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );
  return (
    <section className="grid gap-3">
      <h3 className="text-[11px] font-bold uppercase tracking-[.16em] text-slate-muted">
        {title}
      </h3>
      <div className="grid gap-2">
        {normalized.map((option) => {
          const active = values.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className={
                active
                  ? "filter-option is-active justify-start"
                  : "filter-option justify-start"
              }
              onClick={() => onToggle(option.value)}
            >
              <span
                className={`h-3.5 w-3.5 rounded-[3px] border ${active ? "border-cta bg-cta" : "border-silver"}`}
              />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
