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
      <h2 className="font-display text-2xl font-semibold text-slate">Tóm tắt đơn hàng</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <img src={item.image} alt={item.title} className="h-14 w-14 rounded-2xl object-cover" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-slate">{item.title}</p>
              <p className="text-slate-muted">{item.variantTitle} x {item.quantity}</p>
            </div>
            <b className="text-sm">{formatCurrency(item.unitPrice * item.quantity)}</b>
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
