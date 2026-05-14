"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types/commerce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCartStore } from "@/store/cart.store";
import { useFavoriteStore } from "@/store/favorite.store";
import { cn, formatCurrency } from "@/lib/utils/format";

export function ProductCard({ product }: { product: Product }) {
  const toast = useToast();
  const variant = product.variants[0];
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite(product.id));
  const sellable = variant.inventory.quantityAvailable - variant.inventory.quantityReserved;
  const canBuy = product.status === "active" && variant.active && sellable > 0;

  return (
    <motion.article
      className="group grid self-start overflow-hidden rounded-sm border border-line bg-pearl text-slate shadow-soft transition duration-300 hover:-translate-y-1 hover:border-cta/60"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-silver-100">
        <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex max-w-[calc(100%-72px)] flex-wrap gap-2">
          {product.bestSeller ? <Badge>Best seller</Badge> : <Badge>Bạc S925</Badge>}
          {product.newArrival ? <Badge className="border-cta/40 bg-cta-soft text-navy">Hàng mới</Badge> : null}
        </div>
        <button
          aria-label="Yêu thích"
          className={cn("absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-sm border border-line bg-pearl/80 text-slate backdrop-blur transition hover:border-cta hover:text-cta", isFavorite && "text-cta")}
          onClick={(event) => {
            event.preventDefault();
            toggleFavorite(product.id);
            toast({ tone: "success", title: isFavorite ? "Đã bỏ yêu thích" : "Đã thêm yêu thích", description: product.title });
          }}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </button>
      </Link>
      <div className="flex h-[250px] flex-col p-4 md:p-5">
        <div className="grid gap-2">
          <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-[3.55rem] font-display text-2xl font-medium leading-[1.18] text-slate hover:text-cta">
            {product.title}
          </Link>
          <p className="h-4 truncate text-[11px] uppercase leading-4 tracking-[.22em] text-slate-muted">{product.material} · Đã bán</p>
        </div>
        <div className="mt-5 grid min-h-[54px] grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="grid min-w-0 gap-1">
            <span className="whitespace-nowrap text-lg font-semibold leading-none text-cta">{formatCurrency(variant.price)}</span>
            {variant.compareAtPrice ? (
              <span className="whitespace-nowrap text-sm leading-none text-slate-light line-through">{formatCurrency(variant.compareAtPrice)}</span>
            ) : (
              <span className="h-4" aria-hidden="true" />
            )}
          </div>
          <span className={cn("pt-1 whitespace-nowrap text-xs font-bold uppercase tracking-[.12em]", sellable <= 0 ? "text-slate-light" : sellable <= 3 ? "text-warning" : "text-success")}>
            {sellable <= 0 ? "Hết hàng" : sellable <= 3 ? `Chỉ còn ${sellable}` : "Còn hàng"}
          </span>
        </div>
        <Button
          variant="secondary"
          className="mt-auto h-12 w-full"
          disabled={!canBuy}
          onClick={() => {
            if (!canBuy) {
              toast({ tone: "warning", title: "Chưa thể thêm vào giỏ", description: "Sản phẩm đang hết hàng hoặc inactive." });
              return;
            }
            addItem({
              productId: product.id,
              variantId: variant.id,
              productSlug: product.slug,
              title: product.title,
              variantTitle: variant.title,
              sku: variant.sku,
              image: product.images[0],
              unitPrice: variant.price,
              compareAtPrice: variant.compareAtPrice,
              quantity: 1,
            });
            toast({ tone: "success", title: "Đã thêm vào giỏ", description: product.title });
          }}
        >
          <ShoppingBag className="h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </div>
    </motion.article>
  );
}
