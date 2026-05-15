import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils/format";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn("h-11 w-full rounded-sm border border-input-border bg-input px-4 text-sm text-slate outline-none transition placeholder:text-slate-light focus:border-cta focus:ring-2 focus:ring-cta/20", className)} {...props} />;
});

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-28 w-full rounded-sm border border-input-border bg-input px-4 py-3 text-sm text-slate outline-none transition placeholder:text-slate-light focus:border-cta focus:ring-2 focus:ring-cta/20", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 w-full rounded-sm border border-input-border bg-input px-4 text-sm text-slate outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20", className)} {...props} />;
}

export function Field({ label, error, hint, required, children }: { label: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate">
      <span className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">
        {label}
        {required ? <span className="ml-1 text-danger" aria-label="bắt buộc">*</span> : null}
      </span>
      {children}
      {hint && !error ? <span className="text-xs font-normal leading-5 text-slate-muted">{hint}</span> : null}
      {error ? <span className="text-xs font-normal text-danger">{error}</span> : null}
    </label>
  );
}
