"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

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
  const active = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-sm border border-line bg-pearl px-4 text-left text-sm font-semibold text-slate transition hover:border-cta focus:border-cta focus:outline-none focus:ring-2 focus:ring-cta/20"
      >
        <span>{active?.label}</span>
        <ChevronDown className="h-4 w-4 text-slate-muted" />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-sm border border-line bg-pearl p-1 shadow-premium">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-slate hover:bg-cta-soft/45"
              onClick={() => {
                onChange?.(option.value);
                setOpen(false);
              }}
            >
              {option.label}
              {option.value === value ? <Check className="h-4 w-4 text-cta" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
