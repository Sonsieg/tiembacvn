"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/commerce";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setCouponCode: (code: string) => void;
  subtotal: () => number;
  count: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: "",
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((entry) => entry.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.variantId === item.variantId ? { ...entry, quantity: entry.quantity + item.quantity } : entry,
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, item], isOpen: true };
        }),
      removeItem: (variantId) => set((state) => ({ items: state.items.filter((item) => item.variantId !== variantId) })),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.variantId === variantId ? { ...item, quantity: Math.max(1, quantity) } : item)),
        })),
      clearCart: () => set({ items: [], couponCode: "" }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setCouponCode: (couponCode) => set({ couponCode }),
      subtotal: () => get().items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
      count: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: "tiembac-cart",
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode }),
      skipHydration: true,
    },
  ),
);
