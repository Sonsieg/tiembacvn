"use client";

import { create } from "zustand";

type FilterState = {
  search: string;
  category: string;
  priceRange: [number, number];
  material: string;
  size: string;
  sort: string;
  inStock: boolean;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSort: (sort: string) => void;
  resetFilters: () => void;
};

const initial = {
  search: "",
  category: "",
  priceRange: [0, 2000000] as [number, number],
  material: "Bạc S925",
  size: "",
  sort: "newest",
  inStock: false,
};

export const useFilterStore = create<FilterState>()((set) => ({
  ...initial,
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  resetFilters: () => set(initial),
}));
