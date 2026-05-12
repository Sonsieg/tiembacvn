"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Price } from "@/components/ui/price";
import { formatCurrency } from "@/lib/utils/format";
import { siteConfig } from "@/lib/constants/site";
import { useCartStore } from "@/store/cart.store";

export function CartDrawer() {
  const { items, isOpen, couponCode, closeCart, updateQuantity, removeItem, setCouponCode, subtotal } = useCartStore();
  const total = subtotal();
  const shipping = total >= siteConfig.freeShippingThreshold || total === 0 ? 0 : siteConfig.shippingFee;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 bg-navy/45 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
        >
          <motion.aside
            className="ml-auto flex h-full w-full max-w-md flex-col border-l border-line bg-drawer text-slate shadow-premium"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line bg-pearl/90 p-5 backdrop-blur">
              <div>
                <p className="eyebrow">Giỏ hàng</p>
                <h2 className="text-xl font-semibold text-slate">{items.length} sản phẩm</h2>
              </div>
              <Button aria-label="Đóng giỏ hàng" variant="secondary" size="icon" onClick={closeCart}><X className="h-4 w-4" /></Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length ? (
                <div className="grid gap-4">
                  {items.map((item) => (
                    <article key={item.variantId} className="grid grid-cols-[76px_1fr] gap-3 rounded-sm border border-line bg-pearl p-3 shadow-soft">
                      <Link href={`/products/${item.productSlug}`} onClick={closeCart} className="aspect-square overflow-hidden rounded-sm bg-silver-100">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      </Link>
                      <div className="grid gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link href={`/products/${item.productSlug}`} onClick={closeCart} className="font-medium text-slate hover:text-cta">{item.title}</Link>
                            <p className="text-xs text-slate-muted">{item.variantTitle} · {item.sku}</p>
                          </div>
                          <button aria-label="Xóa sản phẩm" className="text-slate-light hover:text-danger" onClick={() => removeItem(item.variantId)}><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="flex items-center justify-between">
                          <Price value={item.unitPrice} />
                          <div className="flex h-9 items-center rounded-full border border-line bg-ivory-soft">
                            <button className="grid h-9 w-9 place-items-center" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}><Minus className="h-3 w-3" /></button>
                            <span className="w-7 text-center text-sm">{item.quantity}</span>
                            <button className="grid h-9 w-9 place-items-center" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-cta" />
                    <h3 className="font-semibold text-slate">Giỏ hàng đang trống</h3>
                    <p className="mt-2 text-sm text-slate-muted">Chọn một món bạc thật hợp để bắt đầu nhé.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 border-t border-line bg-drawer-footer p-5">
              <Input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="Nhập mã giảm giá" />
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between"><span>Tạm tính</span><b>{formatCurrency(total)}</b></div>
                <div className="flex justify-between"><span>Phí giao hàng</span><b>{shipping ? formatCurrency(shipping) : "Miễn phí"}</b></div>
                <div className="flex justify-between border-t border-line pt-3 text-base"><span>Tổng dự kiến</span><b className="text-cta">{formatCurrency(total + shipping)}</b></div>
              </div>
              <p className="text-xs text-slate-muted">Không cần đăng nhập để mua hàng. Đơn sẽ được xác nhận bằng số điện thoại.</p>
              <ButtonLink href="/checkout" onClick={closeCart} className="w-full">Thanh toán</ButtonLink>
              <Button variant="ghost" onClick={closeCart}>Tiếp tục mua sắm</Button>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
