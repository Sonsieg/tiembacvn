"use client";

import { AlertTriangle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function AdminDrawer({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  width = "max-w-4xl",
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  width?: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 bg-navy/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside className={`absolute right-0 top-0 grid h-full w-full ${width} grid-rows-[auto_1fr_auto] border-l border-line bg-drawer text-slate shadow-premium`} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 260 }}>
            <header className="flex items-start justify-between gap-4 border-b border-line bg-pearl/92 p-5 backdrop-blur">
              <div>
                <h2 className="font-display text-4xl font-semibold leading-none text-slate">{title}</h2>
                {description ? <p className="mt-2 text-sm leading-6 text-slate-muted">{description}</p> : null}
              </div>
              <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-line bg-pearl text-slate hover:border-cta hover:text-navy" aria-label="Đóng">
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="overflow-y-auto p-5">{children}</div>
            {footer ? <footer className="sticky bottom-0 border-t border-line bg-drawer-footer/95 p-4 backdrop-blur">{footer}</footer> : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function AdminModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-navy/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-xl rounded-sm border border-line bg-modal text-slate shadow-premium" initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }}>
            <header className="flex items-center justify-between border-b border-line p-5">
              <h2 className="font-display text-3xl font-semibold text-slate">{title}</h2>
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-sm border border-line bg-pearl text-slate hover:border-cta hover:text-navy" aria-label="Đóng"><X className="h-5 w-5" /></button>
            </header>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ConfirmDialog({
  open,
  title = "Xác nhận thao tác",
  description,
  confirmLabel = "Xác nhận",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <AdminModal open={open} title={title} onClose={onClose}>
      <div className="grid gap-5">
        <div className="flex gap-3 rounded-sm border border-warning/30 bg-warning/10 p-4">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <p className="text-sm leading-6 text-slate-muted">{description}</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
          <Button type="button" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </AdminModal>
  );
}
