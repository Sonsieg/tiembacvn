import type { ReactNode } from "react";
import { cn } from "@/lib/utils/format";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-sm border border-badge-border/45 bg-badge px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-badge-text", className)}>{children}</span>;
}
