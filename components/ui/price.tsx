import { formatCurrency } from "@/lib/utils/format";

export function Price({ value, compareAt }: { value: number; compareAt?: number }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-2">
      <span className="font-semibold text-cta">{formatCurrency(value)}</span>
      {compareAt ? <span className="text-sm text-slate-light line-through">{formatCurrency(compareAt)}</span> : null}
    </span>
  );
}
