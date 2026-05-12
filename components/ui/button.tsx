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
  primary: "bg-claret text-white shadow-premium hover:bg-claret-700",
  secondary: "border border-silver-300 bg-white/80 text-claret hover:border-sky-300 hover:bg-sky-50",
  ghost: "text-claret hover:bg-claret/5",
  dark: "bg-ink text-white hover:bg-claret",
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
      className={cn("inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50", variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({ variant = "primary", size = "md", className, href, ...props }: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300", variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
