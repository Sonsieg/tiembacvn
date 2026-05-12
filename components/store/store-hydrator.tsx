"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { useFavoriteStore } from "@/store/favorite.store";

export function StoreHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useFavoriteStore.persist.rehydrate();
  }, []);

  return null;
}
