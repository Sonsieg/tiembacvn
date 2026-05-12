"use client";

import type { Product } from "@/types/commerce";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { useFavoriteStore } from "@/store/favorite.store";

export function WishlistBrowser({ products }: { products: Product[] }) {
  const favoriteProductIds = useFavoriteStore((state) => state.favoriteProductIds);
  const favorites = products.filter((product) => favoriteProductIds.includes(product.id));

  if (!favorites.length) {
    return (
      <div className="grid gap-5">
        <EmptyState title="Chưa có sản phẩm yêu thích" description="Hãy lưu những món bạc bạn thích để quay lại xem nhanh hơn." />
        <ButtonLink href="/collections" className="mx-auto">Khám phá bộ sưu tập</ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {favorites.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
