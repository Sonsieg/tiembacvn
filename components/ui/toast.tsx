"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/format";

type ToastTone = "success" | "danger" | "info" | "warning";
type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
};
type ToastItem = Required<ToastInput> & { id: string };

const ToastContext = createContext<{ toast: (input: ToastInput) => void } | null>(null);

const toneStyles: Record<ToastTone, { card: string; icon: string; Icon: typeof CheckCircle2 }> = {
  success: { card: "border-success/20 bg-success text-white", icon: "bg-white/18 text-white", Icon: CheckCircle2 },
  danger: { card: "border-danger/20 bg-danger text-white", icon: "bg-white/18 text-white", Icon: XCircle },
  info: { card: "border-sky-200 bg-[#3FAEC4] text-white", icon: "bg-white/18 text-white", Icon: Info },
  warning: { card: "border-warning/20 bg-warning text-white", icon: "bg-white/18 text-white", Icon: AlertTriangle },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = createToastId();
    const item: ToastItem = {
      id,
      title: input.title,
      description: input.description ?? "",
      tone: input.tone ?? "info",
      duration: input.duration ?? 4200,
    };
    setItems((current) => [item, ...current].slice(0, 4));
    window.setTimeout(() => dismiss(id), item.duration);
  }, [dismiss]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] grid w-[min(420px,calc(100vw-32px))] gap-3">
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context.toast;
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const style = toneStyles[item.tone];
  const Icon = style.Icon;

  return (
    <div className={cn("grid grid-cols-[44px_1fr_auto] items-start gap-3 rounded-sm border p-4 shadow-premium animate-fade-in", style.card)} role="status">
      <span className={cn("grid h-9 w-9 place-items-center rounded-full", style.icon)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <b className="block text-sm font-bold leading-5">{item.title}</b>
        {item.description ? <p className="mt-1 text-sm leading-5 text-white/88">{item.description}</p> : null}
      </div>
      <button type="button" className="grid h-7 w-7 place-items-center rounded-sm text-white/88 hover:bg-white/14 hover:text-white" onClick={onDismiss} aria-label="Đóng thông báo">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
