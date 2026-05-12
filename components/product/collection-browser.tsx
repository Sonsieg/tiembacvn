"use client";

import { Search } from "lucide-react";
import type { Category, Product } from "@/types/commerce";
import { Input } from "@/components/ui/form";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductCard } from "@/components/product/product-card";
import { useFilterStore } from "@/store/filter.store";
import { ActiveFiltersBar, FilterDrawer, FilterSidebar, SortSelect } from "@/components/filter/filter-components";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export function CollectionBrowser({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { search, categories: selectedCategories, priceRange, materials, sizes, styles, occasions, statuses, sort, setSearch, resetFilters } = useFilterStore();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("focus") === "search") {
      searchInputRef.current?.focus();
    }
  }, []);

  const filtered = products
    .filter((product) => (search ? product.title.toLowerCase().includes(search.toLowerCase()) : true))
    .filter((product) => (selectedCategories.length ? selectedCategories.some((category) => product.categorySlugs.includes(category)) : true))
    .filter((product) => {
      const prices = product.variants.map((variant) => variant.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return max >= priceRange[0] && min <= priceRange[1];
    })
    .filter((product) => (materials.length ? materials.some((material) => product.material.toLowerCase().includes(material.toLowerCase().replace("bạc ", "")) || product.material === material) : true))
    .filter((product) => (sizes.length ? product.variants.some((variant) => sizes.includes(variant.title) || sizes.includes(variant.size ?? "")) : true))
    .filter((product) => (styles.length ? styles.some((style) => matchesProductTerm(product, style)) : true))
    .filter((product) => (occasions.length ? occasions.some((occasion) => matchesProductTerm(product, occasion)) : true))
    .filter((product) => {
      if (!statuses.length) return true;
      const sellable = product.variants.reduce((sum, variant) => sum + variant.inventory.quantityAvailable - variant.inventory.quantityReserved, 0);
      return statuses.some((status) => {
        if (status === "Còn hàng") return sellable > 0;
        if (status === "Đang sale") return product.variants.some((variant) => variant.compareAtPrice && variant.compareAtPrice > variant.price);
        if (status === "Hàng mới") return product.newArrival;
        if (status === "Bán chạy") return product.bestSeller;
        return true;
      });
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.variants[0].price - b.variants[0].price;
      if (sort === "price-desc") return b.variants[0].price - a.variants[0].price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "sale") return Number(Boolean(b.variants[0].compareAtPrice)) - Number(Boolean(a.variants[0].compareAtPrice));
      if (sort === "best") return Number(b.bestSeller) - Number(a.bestSeller);
      return Number(b.newArrival) - Number(a.newArrival);
    });

  const pageSize = 9;
  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
      <FilterSidebar categories={categories} />
      <div className="grid content-start gap-5">
        <div className="self-start rounded-sm border border-line bg-pearl p-3 shadow-soft">
          <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_220px_auto_auto] lg:grid-cols-[minmax(260px,1fr)_220px_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light" />
              <Input ref={searchInputRef} className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm nhẫn, dây chuyền, vòng tay..." />
            </div>
            <SortSelect />
            <FilterDrawer categories={categories} />
            <Button type="button" variant="ghost" onClick={resetFilters} className="hidden md:inline-flex">Xóa lọc</Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <ActiveFiltersBar categories={categories} />
            <span className="text-xs font-bold uppercase tracking-[.16em] text-slate-muted">{filtered.length} sản phẩm</span>
          </div>
        </div>
        {pageProducts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pageProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : <ProductGrid products={[]} />}
        <CatalogPagination page={currentPage} totalPages={totalPages} onPage={setPage} />
      </div>
    </div>
  );
}

function CatalogPagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (page: number) => void }) {
  return (
    <nav className="mt-8 flex items-center justify-center gap-3 border-t border-line pt-8 text-[11px] font-bold uppercase tracking-[.18em] text-slate-muted" aria-label="Phân trang sản phẩm">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
        <button key={item} type="button" onClick={() => onPage(item)} className={item === page ? "text-cta" : "hover:text-slate"}>
          {String(item).padStart(2, "0")}
        </button>
      ))}
      <button type="button" onClick={() => onPage(Math.min(page + 1, totalPages))} className="ml-3 hover:text-cta">Tiếp</button>
    </nav>
  );
}

function matchesProductTerm(product: Product, term: string) {
  const value = term.toLowerCase();
  const haystack = [
    product.title,
    product.shortDescription,
    product.description,
    product.material,
    ...product.tags,
    ...product.categorySlugs,
    ...product.collectionSlugs,
  ].join(" ").toLowerCase();

  if (value === "tối giản") return haystack.includes("minimal") || haystack.includes("tối giản");
  if (value === "sang trọng") return haystack.includes("signature") || haystack.includes("đá") || haystack.includes("opal") || haystack.includes("ngọc");
  if (value === "dễ thương") return haystack.includes("charm") || haystack.includes("tim") || haystack.includes("ngôi sao");
  if (value === "vintage") return haystack.includes("đá màu") || haystack.includes("claret");
  if (value === "sinh nhật" || value === "kỷ niệm" || value === "valentine" || value === "quà cho nàng" || value === "quà cho mẹ") return product.giftWrap || haystack.includes("quà");
  if (value === "dùng hằng ngày") return haystack.includes("đi làm") || haystack.includes("minimal") || haystack.includes("tối giản");

  return haystack.includes(value);
}
