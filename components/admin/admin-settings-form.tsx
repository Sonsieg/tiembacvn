"use client";

import { useState } from "react";
import { AdminDropdown } from "@/components/admin/admin-dropdown";
import { useToast } from "@/components/ui/toast";

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
  const toast = useToast();
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
            onChange={(value) => {
              setValues((current) => ({ ...current, [key]: value }));
              toast({ tone: "info", title: "Đã đổi trạng thái section", description: `${label}: ${value === "active" ? "đang hiển thị" : "ẩn khỏi storefront"} ở UI preview.` });
            }}
          />
        </label>
      ))}
    </div>
  );
}

export function SettingsSaveButton() {
  const toast = useToast();

  return (
    <button
      type="button"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-cta bg-cta px-5 text-sm font-bold uppercase tracking-[.12em] text-cta-text transition hover:border-cta-hover hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-cta/35"
      onClick={() => toast({ tone: "info", title: "Đã lưu bản nháp cài đặt", description: "Cài đặt cửa hàng đang ở UI preview, chưa ghi database." })}
    >
      Lưu cài đặt
    </button>
  );
}
