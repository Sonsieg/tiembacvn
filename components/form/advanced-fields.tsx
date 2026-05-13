"use client";

import { Check, ChevronDown, ImagePlus, Search, X } from "lucide-react";
import type { ComponentProps } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/form";
import { cn, formatCurrency, slugify } from "@/lib/utils/format";

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
  const dropdownId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.filter((option) => values.includes(option.value));
  const visible = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
  const summary = selected.length ? `${selected.length} đã chọn` : placeholder;

  function toggle(value: string) {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative grid gap-2 text-sm font-medium text-slate">
      <span>{label}</span>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? dropdownId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "!flex min-h-11 w-full !items-center !justify-between gap-3 rounded-sm !border !border-input-border !bg-input px-4 py-2 text-left text-sm font-medium text-slate outline-none transition",
          "hover:!border-cta/70 hover:!bg-input focus:!border-cta focus:ring-2 focus:ring-cta/20",
          open && "!border-cta ring-2 ring-cta/15",
        )}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selected.length ? selected.map((option) => (
            <span key={option.value} className="inline-flex min-w-0 items-center gap-1 rounded-sm border border-cta/35 bg-cta-soft px-2 py-1 text-xs font-semibold text-navy">
              <span className="max-w-36 truncate">{option.label}</span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Bỏ chọn ${option.label}`}
                className="shrink-0 text-slate-muted hover:text-navy"
                onClick={(event) => {
                  event.stopPropagation();
                  toggle(option.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    toggle(option.value);
                  }
                }}
              >
                <X className="h-3 w-3" />
              </span>
            </span>
          )) : <span className="min-w-0 truncate text-slate-light">{summary}</span>}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-muted transition-transform", open && "rotate-180 text-cta")} />
      </button>
      {open ? (
        <div
          id={dropdownId}
          className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-sm border border-input-border bg-pearl p-1 shadow-premium"
          role="listbox"
          aria-multiselectable="true"
        >
          <div className="relative border-b border-line p-2">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <Input className="!pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm..." />
          </div>
          <button
            type="button"
            className="!flex w-full !items-center !justify-between gap-3 rounded-sm !border-none !bg-transparent px-3.5 py-2.5 text-left text-sm font-medium text-slate transition hover:!bg-cta-soft/45 hover:text-navy focus:!bg-cta-soft/45 focus:text-navy focus:outline-none"
            onClick={() => onChange(values.length === options.length ? [] : options.map((option) => option.value))}
          >
            <span>{values.length === options.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}</span>
            {values.length === options.length ? <Check className="h-4 w-4 shrink-0 text-cta" /> : null}
          </button>
          <div className="max-h-64 overflow-y-auto p-1">
            {visible.length ? visible.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "!flex w-full !items-center !justify-between gap-3 rounded-sm !border-none !bg-transparent px-3.5 py-2.5 text-left text-sm text-slate transition",
                  "hover:!bg-cta-soft/45 hover:text-navy focus:!bg-cta-soft/45 focus:text-navy focus:outline-none",
                  values.includes(option.value) && "font-medium text-navy",
                )}
                role="option"
                aria-selected={values.includes(option.value)}
                onClick={() => toggle(option.value)}
              >
                <span className="min-w-0 flex-1">{option.label}</span>
                {values.includes(option.value) ? <Check className="h-4 w-4 shrink-0 text-cta" /> : null}
              </button>
            )) : <p className="p-4 text-sm text-slate-muted">Không tìm thấy lựa chọn phù hợp.</p>}
          </div>
        </div>
      ) : null}
    </div>
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
