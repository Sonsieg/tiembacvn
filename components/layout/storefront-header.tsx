"use client";

import Link from "next/link";
import { Heart, Home, Menu, PackageSearch, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  ["Cẩm nang", "/journal"],
  ["Tra cứu đơn", "/track-order"],
];

export function StorefrontHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openCart = useCartStore((state) => state.openCart);
  const count = useCartStore((state) => state.count());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition ${scrolled ? "border-line bg-pearl/92 shadow-soft" : "border-line/70 bg-ivory/82"}`}>
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 font-display text-2xl font-semibold tracking-[.08em] text-navy">
            <LuxuryMark />
            <span>Tiembac.vn</span>
          </Link>
          <nav className="hidden items-center gap-7 text-[11px] font-bold uppercase tracking-[.18em] text-slate-muted lg:flex">
            {nav.slice(1).map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-cta">{label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button aria-label="Tìm kiếm" variant="ghost" size="icon" className="border-line/80 bg-pearl/70"><Search className="h-4 w-4" /></Button>
            <Button aria-label="Yêu thích" variant="ghost" size="icon" className="border-line/80 bg-pearl/70"><Heart className="h-4 w-4" /></Button>
            <Button aria-label="Giỏ hàng" variant="ghost" size="icon" className="relative border-line/80 bg-pearl/70" onClick={openCart}>
              <ShoppingBag className="h-4 w-4" />
              {count ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-cta px-1 text-[11px] text-navy">{count}</span> : null}
            </Button>
            <Button aria-label="Mở menu" variant="ghost" size="icon" className="border-line/80 bg-pearl/70 lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 bg-navy/45 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.aside className="h-full w-80 max-w-[86vw] border-r border-line bg-ivory p-5 text-slate shadow-premium" initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}>
              <div className="mb-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 font-display text-2xl font-semibold tracking-[.08em] text-navy" onClick={() => setOpen(false)}><LuxuryMark /> Tiembac.vn</Link>
                <Button aria-label="Đóng menu" variant="secondary" size="icon" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <nav className="grid gap-2">
                {nav.map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-sm border border-transparent px-4 py-3 text-xs font-bold uppercase tracking-[.16em] text-slate-muted hover:border-line hover:bg-pearl hover:text-cta">{label}</Link>
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-line bg-pearl/94 px-2 py-2 text-[10px] uppercase tracking-[.08em] text-slate-muted shadow-[0_-12px_28px_rgba(22,32,51,0.08)] backdrop-blur-xl md:hidden">
      <Link className="grid place-items-center gap-1" href="/"><Home className="h-5 w-5" />Trang chủ</Link>
      <Link className="grid place-items-center gap-1" href="/collections"><Search className="h-5 w-5" />Bộ sưu tập</Link>
      <Link className="grid place-items-center gap-1" href="/collections?favorite=1"><Heart className="h-5 w-5" />Yêu thích</Link>
      <button className="grid place-items-center gap-1" onClick={openCart}><ShoppingBag className="h-5 w-5" />Giỏ hàng</button>
      <Link className="grid place-items-center gap-1" href="/track-order"><PackageSearch className="h-5 w-5" />Tra cứu</Link>
    </nav>
  );
}

export function AnnouncementBar() {
  return (
    <div className="bg-navy px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[.16em] text-ivory">
      <span className="inline-flex items-center gap-2"><Sparkles className="h-3 w-3" /> Bạc S925 chuẩn · Miễn phí vận chuyển từ 900.000đ · Đánh bóng miễn phí</span>
    </div>
  );
}
