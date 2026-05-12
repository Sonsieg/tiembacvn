"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoriteState = {
  favoriteProductIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
};

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteProductIds: [],
      toggleFavorite: (productId) =>
        set((state) => ({
          favoriteProductIds: state.favoriteProductIds.includes(productId)
            ? state.favoriteProductIds.filter((id) => id !== productId)
            : [...state.favoriteProductIds, productId],
        })),
      isFavorite: (productId) => get().favoriteProductIds.includes(productId),
    }),
    { name: "tiembac-favorites", skipHydration: true },
  ),
);
