import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/format";

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost" | "dark";
  size?: "sm" | "md" | "lg" | "icon";
  children: ReactNode;
  className?: string;
};

const variants = {
  primary: "border border-cta bg-cta text-cta-text shadow-none hover:border-cta-hover hover:bg-cta-hover",
  secondary: "border border-line bg-pearl text-slate hover:border-cta hover:bg-cta-soft/35 hover:text-navy",
  ghost: "border border-transparent text-slate hover:bg-cta-soft/35 hover:text-navy",
  dark: "border border-navy bg-navy text-copy-inverse hover:border-navy-soft hover:bg-navy-soft",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

export function Button({ variant = "primary", size = "md", className, ...props }: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("inline-flex items-center justify-center gap-2 rounded-sm font-bold uppercase tracking-[.12em] transition focus:outline-none focus:ring-2 focus:ring-cta/35 disabled:cursor-not-allowed disabled:opacity-50", variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({ variant = "primary", size = "md", className, href, ...props }: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center justify-center gap-2 rounded-sm font-bold uppercase tracking-[.12em] transition focus:outline-none focus:ring-2 focus:ring-cta/35", variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
