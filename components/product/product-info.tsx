"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Ruler, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react";
import type { Product } from "@/types/commerce";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { RatingStars } from "@/components/ui/rating-stars";
import { useCartStore } from "@/store/cart.store";
import { useFavoriteStore } from "@/store/favorite.store";
import { cn } from "@/lib/utils/format";

export function ProductInfo({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const variant = product.variants.find((entry) => entry.id === variantId) ?? product.variants[0];
  const sellable = variant.inventory.quantityAvailable - variant.inventory.quantityReserved;
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const favorite = useFavoriteStore((state) => state.isFavorite(product.id));

  const addToCart = () =>
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
      quantity,
    });

  return (
    <div className="sticky top-24 grid gap-6">
      <div className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge>Bạc S925</Badge>
          <Badge className="border-sky-200 text-sky-700">Gói quà tinh tế</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">{product.title}</h1>
        <p className="text-gray-600">{product.shortDescription}</p>
        <RatingStars rating={product.rating} count={product.reviewCount} />
        <div className="text-2xl"><Price value={variant.price} compareAt={variant.compareAtPrice} /></div>
      </div>

      <div className="grid gap-3 rounded-[1.5rem] border border-silver-200 bg-white/80 p-4">
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          <span>Chất liệu: <b className="text-ink">{product.material}</b></span>
          <span>Trọng lượng: <b className="text-ink">{product.weight}</b></span>
          <span>Đá: <b className="text-ink">{product.stone ?? "Không"}</b></span>
          <span>Bảo hành: <b className="text-ink">{product.warrantyMonths} tháng</b></span>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-ink">Chọn size</span>
          <Link href="/policy/huong-dan-chon-size" className="inline-flex items-center gap-1 text-sm text-claret hover:text-sky-700"><Ruler className="h-4 w-4" /> Hướng dẫn chọn size</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((entry) => (
            <button key={entry.id} className={cn("h-10 rounded-full border px-4 text-sm transition", variantId === entry.id ? "border-claret bg-claret text-white" : "border-silver-200 bg-white text-ink hover:border-sky-300")} onClick={() => setVariantId(entry.id)}>
              {entry.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 items-center rounded-full border border-silver-200 bg-white">
          <button className="h-12 w-12 text-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <button className="h-12 w-12 text-lg" onClick={() => setQuantity(Math.min(sellable, quantity + 1))}>+</button>
        </div>
        <span className={cn("text-sm", sellable <= 3 ? "text-amber-600" : "text-emerald-700")}>{sellable > 0 ? `Còn ${sellable} sản phẩm` : "Hết hàng"}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <Button disabled={sellable <= 0} onClick={addToCart}><ShoppingBag className="h-4 w-4" /> Thêm vào giỏ</Button>
        <ButtonLink href="/checkout" variant="dark" onClick={addToCart}>Mua ngay</ButtonLink>
        <Button aria-label="Yêu thích" variant="secondary" size="icon" onClick={() => toggleFavorite(product.id)}>
          <Heart className={cn("h-4 w-4", favorite && "fill-current text-red-500")} />
        </Button>
      </div>

      <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
        {[
          [Sparkles, "Mua hàng không cần đăng nhập"],
          [ShieldCheck, "Thanh toán an toàn"],
          [Truck, "Đổi size dễ dàng"],
          [ShoppingBag, "Đóng gói quà tặng"],
        ].map(([Icon, label]) => (
          <span key={label as string} className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
            <Icon className="h-4 w-4 text-claret" /> {label as string}
          </span>
        ))}
      </div>
    </div>
  );
}
