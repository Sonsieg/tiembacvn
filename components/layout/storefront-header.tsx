"use client";

import Link from "next/link";
import { Heart, Home, Menu, PackageSearch, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LuxuryMark } from "@/components/ui/states";
import { useCartStore } from "@/store/cart.store";

const nav = [
  ["Trang chủ", "/"],
  ["Bộ sưu tập", "/collections"],
  ["Nhẫn", "/collections/nhan-bac"],
  ["Dây chuyền", "/collections/day-chuyen-bac"],
  ["Vòng tay", "/collections/vong-tay-bac"],
  ["Bông tai", "/collections/bong-tai-bac"],
  ["Quà tặng", "/collections/qua-tang"],
  ["Journal", "/journal"],
  ["Tra cứu đơn", "/track-order"],
];

export function StorefrontHeader() {
  const [open, setOpen] = useState(false);
  const openCart = useCartStore((state) => state.openCart);
  const count = useCartStore((state) => state.count());

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/40 bg-pearl/75 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 font-semibold text-claret">
            <LuxuryMark />
            <span>Tiembac.vn</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-ink lg:flex">
            {nav.slice(1).map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-claret">{label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button aria-label="Tìm kiếm" variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
            <Button aria-label="Yêu thích" variant="ghost" size="icon"><Heart className="h-4 w-4" /></Button>
            <Button aria-label="Giỏ hàng" variant="secondary" size="icon" className="relative" onClick={openCart}>
              <ShoppingBag className="h-4 w-4" />
              {count ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-claret px-1 text-[11px] text-white">{count}</span> : null}
            </Button>
            <Button aria-label="Mở menu" variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.aside className="h-full w-80 max-w-[86vw] bg-pearl p-5 shadow-premium" initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}>
              <div className="mb-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 font-semibold text-claret" onClick={() => setOpen(false)}><LuxuryMark /> Tiembac.vn</Link>
                <Button aria-label="Đóng menu" variant="secondary" size="icon" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <nav className="grid gap-2">
                {nav.map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-medium text-ink hover:bg-white hover:text-claret">{label}</Link>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function MobileBottomNav() {
  const openCart = useCartStore((state) => state.openCart);
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-silver-200 bg-white/90 px-2 py-2 text-[11px] text-gray-600 backdrop-blur-xl md:hidden">
      <Link className="grid place-items-center gap-1" href="/"><Home className="h-5 w-5" />Trang chủ</Link>
      <Link className="grid place-items-center gap-1" href="/collections"><Search className="h-5 w-5" />Tìm kiếm</Link>
      <Link className="grid place-items-center gap-1" href="/collections?favorite=1"><Heart className="h-5 w-5" />Yêu thích</Link>
      <button className="grid place-items-center gap-1" onClick={openCart}><ShoppingBag className="h-5 w-5" />Giỏ hàng</button>
      <Link className="grid place-items-center gap-1" href="/track-order"><PackageSearch className="h-5 w-5" />Tra cứu</Link>
    </nav>
  );
}

export function AnnouncementBar() {
  return (
    <div className="bg-claret px-4 py-2 text-center text-xs font-medium text-white">
      <span className="inline-flex items-center gap-2"><Sparkles className="h-3 w-3" /> Miễn phí vận chuyển từ 900.000đ · Mua hàng không cần đăng nhập</span>
    </div>
  );
}
