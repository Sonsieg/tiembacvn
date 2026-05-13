"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/format";

export type AdminDropdownOption = { value: string; label: string };

export function AdminDropdown({
  value,
  options,
  onChange,
  ariaLabel,
  className = "",
}: {
  value: string;
  options: AdminDropdownOption[];
  onChange?: (value: string) => void;
  ariaLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const dropdownId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const active = options.find((option) => option.value === value) ?? options[0];

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
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={open ? dropdownId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-sm border border-input-border bg-input px-4 text-left text-sm font-medium text-slate outline-none transition",
          "hover:border-cta/70 focus:border-cta focus:ring-2 focus:ring-cta/20",
          open && "border-cta ring-2 ring-cta/15",
        )}
      >
        <span className="min-w-0 flex-1 truncate">{active?.label}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-muted transition-transform", open && "rotate-180 text-cta")} />
      </button>
      {open ? (
        <div
          id={dropdownId}
          className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-sm border border-input-border bg-pearl p-1 shadow-premium"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-sm !border-none !bg-transparent px-3.5 py-2.5 text-left text-sm text-slate transition",
                "hover:!bg-cta-soft/45 hover:text-navy focus:!bg-cta-soft/45 focus:text-navy focus:outline-none",
                option.value === value && "font-medium text-navy",
              )}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange?.(option.value);
                setOpen(false);
              }}
            >
              <span className="min-w-0 flex-1">{option.label}</span>
              {option.value === value ? <Check className="h-4 w-4 shrink-0 text-cta" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
