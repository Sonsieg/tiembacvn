"use client";

import { Check, ChevronDown, ImagePlus, Search, X } from "lucide-react";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/form";
import { formatCurrency, slugify } from "@/lib/utils/format";

export type SelectOption = { label: string; value: string };

export function SearchableMultiSelect({
  label,
  options,
  values,
  onChange,
  placeholder = "Tìm và chọn...",
}: {
  label: string;
  options: SelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.filter((option) => values.includes(option.value));
  const visible = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  function toggle(value: string) {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  return (
    <label className="relative grid gap-2 text-sm font-medium text-slate">
      <span>{label}</span>
      <button type="button" onClick={() => setOpen((current) => !current)} className="min-h-11 w-full rounded-sm border border-input-border bg-input px-3 py-2 text-left text-slate transition hover:border-cta focus:outline-none focus:ring-2 focus:ring-cta/20">
        <span className="flex min-h-6 flex-wrap items-center gap-2">
          {selected.length ? selected.map((option) => (
            <span key={option.value} className="inline-flex items-center gap-1 rounded-sm border border-cta/40 bg-cta-soft px-2 py-1 text-xs font-semibold text-navy">
              {option.label}
              <span onClick={(event) => { event.stopPropagation(); toggle(option.value); }}><X className="h-3 w-3" /></span>
            </span>
          )) : <span className="text-slate-light">{placeholder}</span>}
          <ChevronDown className="ml-auto h-4 w-4 text-slate-light" />
        </span>
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-sm border border-line bg-pearl shadow-premium">
          <div className="relative border-b border-line p-3">
            <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light" />
            <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm..." />
          </div>
          <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate hover:bg-cta-soft/35" onClick={() => onChange(values.length === options.length ? [] : options.map((option) => option.value))}>
            Chọn tất cả
            {values.length === options.length ? <Check className="h-4 w-4" /> : null}
          </button>
          <div className="max-h-64 overflow-y-auto p-2">
            {visible.length ? visible.map((option) => (
              <button key={option.value} type="button" className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-slate hover:bg-cta-soft/35" onClick={() => toggle(option.value)}>
                {option.label}
                {values.includes(option.value) ? <Check className="h-4 w-4 text-cta" /> : null}
              </button>
            )) : <p className="p-4 text-sm text-slate-muted">Không tìm thấy lựa chọn phù hợp.</p>}
          </div>
        </div>
      ) : null}
    </label>
  );
}

export function TagSelector(props: Omit<ComponentProps<typeof SearchableMultiSelect>, "placeholder">) {
  return <SearchableMultiSelect {...props} placeholder="Chọn tag hiển thị..." />;
}

export function PriceInput({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  const display = useMemo(() => (value ? formatCurrency(value).replace("₫", "").trim() : ""), [value]);
  return (
    <label className="grid gap-2 text-sm font-medium text-slate">
      <span>{label}</span>
      <Input inputMode="numeric" value={display} onChange={(event) => onChange(Number(event.target.value.replace(/\D/g, "")))} placeholder="0" />
    </label>
  );
}

export function SlugInput({ title, value, onChange }: { title: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate">
      <span>Slug SEO</span>
      <Input value={value || slugify(title)} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function ImageUploader({ urls, onChange }: { urls: string[]; onChange: (urls: string[]) => void }) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {urls.map((url, index) => (
          <div key={index} className="grid gap-2">
            <div className="grid aspect-square place-items-center overflow-hidden rounded-2xl border border-silver-200 bg-pearl">
              {url ? <img src={url} alt={`Ảnh sản phẩm ${index + 1}`} className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6 text-slate-light" />}
            </div>
            <Input value={url} onChange={(event) => onChange(urls.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))} placeholder="Supabase Storage URL" />
          </div>
        ))}
      </div>
      <button type="button" className="admin-action-button w-fit" onClick={() => onChange([...urls, ""])}><ImagePlus className="h-4 w-4" /> Thêm ảnh</button>
    </div>
  );
}

export function YoutubeUrlInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const id = parseYoutubeId(value);
  return (
    <div className="grid gap-3">
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
      {id ? <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="YouTube thumbnail preview" className="aspect-video w-full rounded-2xl object-cover" /> : <p className="text-sm text-slate-muted">Dán URL YouTube để tự nhận ID và preview thumbnail.</p>}
    </div>
  );
}

function parseYoutubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] ?? "";
}
