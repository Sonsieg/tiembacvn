import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/format";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-sm border border-line bg-surface-elevated shadow-soft", className)} {...props} />;
}
