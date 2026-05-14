"use client";

import { formatCurrency } from "@/lib/utils/format";
import { siteConfig } from "@/lib/constants/site";
import { useCartStore } from "@/store/cart.store";

export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const shipping = subtotal >= siteConfig.freeShippingThreshold || subtotal === 0 ? 0 : siteConfig.shippingFee;
  return (
    <aside className="rounded-sm border border-line bg-pearl p-5 text-slate shadow-soft">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-cta">Đơn hàng</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-navy">Tóm tắt thanh toán</h2>
      </div>
      <div className="mt-5 grid max-h-[360px] gap-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.variantId} className="grid grid-cols-[56px_minmax(0,1fr)_auto] gap-3 rounded-sm border border-line bg-ivory-soft p-2">
            <img src={item.image} alt={item.title} className="h-14 w-14 rounded-sm object-cover" />
            <div className="min-w-0 text-sm">
              <p className="truncate font-medium text-ink">{item.title}</p>
              <p className="text-slate-muted">{item.variantTitle} x {item.quantity}</p>
            </div>
            <b className="whitespace-nowrap text-sm text-slate">{formatCurrency(item.unitPrice * item.quantity)}</b>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between"><span>Tạm tính</span><b>{formatCurrency(subtotal)}</b></div>
        <div className="flex justify-between"><span>Giao hàng</span><b>{shipping ? formatCurrency(shipping) : "Miễn phí"}</b></div>
        <div className="flex justify-between text-lg"><span>Tổng dự kiến</span><b className="text-cta">{formatCurrency(subtotal + shipping)}</b></div>
      </div>
    </aside>
  );
}
