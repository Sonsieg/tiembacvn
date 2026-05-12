import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/format";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[1.5rem] border border-silver-200 bg-white shadow-soft", className)} {...props} />;
}
