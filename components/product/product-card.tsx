"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types/commerce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { RatingStars } from "@/components/ui/rating-stars";
import { useCartStore } from "@/store/cart.store";
import { useFavoriteStore } from "@/store/favorite.store";
import { cn } from "@/lib/utils/format";

export function ProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite(product.id));
  const sellable = variant.inventory.quantityAvailable - variant.inventory.quantityReserved;

  return (
    <motion.article
      className="group overflow-hidden rounded-[1.5rem] border border-silver-200 bg-white shadow-soft transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-premium"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-silver-100">
        <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge>Bạc S925</Badge>
          {product.newArrival ? <Badge className="border-sky-200 text-sky-700">Mới</Badge> : null}
        </div>
        <button
          aria-label="Yêu thích"
          className={cn("absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-claret shadow-sm backdrop-blur transition hover:bg-white", isFavorite && "text-red-500")}
          onClick={(event) => {
            event.preventDefault();
            toggleFavorite(product.id);
          }}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </button>
      </Link>
      <div className="grid gap-3 p-4">
        <div className="grid gap-1">
          <Link href={`/products/${product.slug}`} className="line-clamp-2 font-semibold text-ink hover:text-claret">
            {product.title}
          </Link>
          <RatingStars rating={product.rating} count={product.reviewCount} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Price value={variant.price} compareAt={variant.compareAtPrice} />
          <span className={cn("text-xs font-medium", sellable <= 0 ? "text-red-600" : sellable <= 3 ? "text-amber-600" : "text-emerald-700")}>
            {sellable <= 0 ? "Hết hàng" : sellable <= 3 ? `Chỉ còn ${sellable}` : "Còn hàng"}
          </span>
        </div>
        <Button
          variant="secondary"
          className="w-full"
          disabled={sellable <= 0}
          onClick={() =>
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
            })
          }
        >
          <ShoppingBag className="h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </div>
    </motion.article>
  );
}
