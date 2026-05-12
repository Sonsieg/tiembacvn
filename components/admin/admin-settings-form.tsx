"use client";

import { useState } from "react";
import { AdminDropdown } from "@/components/admin/admin-dropdown";

const sectionOptions = [
  { value: "active", label: "Đang hiển thị" },
  { value: "hidden", label: "Ẩn khỏi storefront" },
];

const sections = [
  ["hero", "Hero"],
  ["featuredCategories", "Danh mục nổi bật"],
  ["newArrivals", "Sản phẩm mới"],
  ["bestSellers", "Bán chạy"],
  ["giftCollection", "Bộ quà tặng"],
  ["videoReview", "Video review"],
  ["journalSeo", "Cẩm nang & SEO"],
];

export function StorefrontSectionSettings() {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(sections.map(([key]) => [key, "active"])));

  return (
    <div className="grid gap-4">
      {sections.map(([key, label]) => (
        <label key={key} className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">{label}</span>
          <AdminDropdown
            ariaLabel={`Trạng thái section ${label}`}
            value={values[key]}
            options={sectionOptions}
            onChange={(value) => setValues((current) => ({ ...current, [key]: value }))}
          />
        </label>
      ))}
    </div>
  );
}
