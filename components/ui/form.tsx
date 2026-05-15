import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
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

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  tooltip?: string;
  required?: boolean;
  children: ReactNode;
};

export function Field({ label, error, hint, tooltip, required, children }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate">
      <span className="relative flex w-fit max-w-full items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-slate-muted">
        <span>
          {label}
          {required ? <span className="ml-1 text-danger" aria-label="bắt buộc">*</span> : null}
        </span>
        {tooltip ? (
          <span className="group relative inline-flex normal-case tracking-normal" tabIndex={0} aria-label={tooltip}>
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-line bg-pearl text-[10px] font-bold leading-none text-slate-muted">
              ?
            </span>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-64 max-w-[calc(100vw-3rem)] rounded-sm border border-line bg-ink px-3 py-2 text-xs font-medium leading-5 text-white shadow-soft group-hover:block group-focus:block"
            >
              {tooltip}
            </span>
          </span>
        ) : null}
      </span>
      {children}
      {hint && !error ? <span className="text-xs font-normal leading-5 text-slate-muted">{hint}</span> : null}
      {error ? <span className="text-xs font-normal text-danger">{error}</span> : null}
    </label>
  );
}
