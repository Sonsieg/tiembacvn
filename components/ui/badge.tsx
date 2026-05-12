import type { ReactNode } from "react";
import { cn } from "@/lib/utils/format";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border border-silver-200 bg-white/80 px-3 py-1 text-xs font-medium text-claret shadow-sm", className)}>{children}</span>;
}
