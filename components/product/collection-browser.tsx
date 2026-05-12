"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { Category, Product } from "@/types/commerce";
import { Input, Select } from "@/components/ui/form";
import { ProductGrid } from "@/components/product/product-grid";
import { useFilterStore } from "@/store/filter.store";

export function CollectionBrowser({ products, categories }: { products: Product[]; categories: Category[] }) {
  const { search, category, sort, setSearch, setCategory, setSort } = useFilterStore();
  const filtered = products
    .filter((product) => (search ? product.title.toLowerCase().includes(search.toLowerCase()) : true))
    .filter((product) => (category ? product.categorySlugs.includes(category) : true))
    .sort((a, b) => {
      if (sort === "price-asc") return a.variants[0].price - b.variants[0].price;
      if (sort === "price-desc") return b.variants[0].price - a.variants[0].price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "best") return Number(b.bestSeller) - Number(a.bestSeller);
      return Number(b.newArrival) - Number(a.newArrival);
    });

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="hidden rounded-[2rem] border border-silver-200 bg-white p-5 shadow-soft lg:block">
        <div className="mb-4 flex items-center gap-2 font-semibold text-ink"><SlidersHorizontal className="h-4 w-4" /> Bộ lọc</div>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">Loại sản phẩm
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">Tất cả</option>
              {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
            </Select>
          </label>
          <FilterPill label="Chất liệu" value="Bạc S925" />
          <FilterPill label="Phong cách" value="Thanh lịch · Tối giản · Quà tặng" />
          <FilterPill label="Tồn kho" value="Còn hàng, sắp hết hàng" />
        </div>
      </aside>
      <div className="grid gap-5">
        <div className="grid gap-3 rounded-[2rem] border border-silver-200 bg-white p-3 shadow-soft sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm nhẫn, dây chuyền, vòng tay..." />
          </div>
          <Select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="best">Bán chạy</option>
            <option value="rating">Đánh giá cao</option>
          </Select>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

function FilterPill({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-pearl p-4 text-sm"><b className="block text-ink">{label}</b><span className="text-gray-500">{value}</span></div>;
}
