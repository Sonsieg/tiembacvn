"use client";

import { create } from "zustand";

type FilterState = {
  search: string;
  categories: string[];
  priceRange: [number, number];
  materials: string[];
  sizes: string[];
  styles: string[];
  occasions: string[];
  statuses: string[];
  sort: string;
  setCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
  setPriceRange: (priceRange: [number, number]) => void;
  setMaterials: (materials: string[]) => void;
  toggleMaterial: (material: string) => void;
  setSizes: (sizes: string[]) => void;
  toggleSize: (size: string) => void;
  setStyles: (styles: string[]) => void;
  toggleStyle: (style: string) => void;
  setOccasions: (occasions: string[]) => void;
  toggleOccasion: (occasion: string) => void;
  setStatuses: (statuses: string[]) => void;
  toggleStatus: (status: string) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  resetFilters: () => void;
  removeFilter: (group: "categories" | "materials" | "sizes" | "styles" | "occasions" | "statuses", value: string) => void;
};

const initial = {
  search: "",
  categories: [] as string[],
  priceRange: [0, 2000000] as [number, number],
  materials: [] as string[],
  sizes: [] as string[],
  styles: [] as string[],
  occasions: [] as string[],
  statuses: [] as string[],
  sort: "newest",
};

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export const useFilterStore = create<FilterState>()((set) => ({
  ...initial,
  setSearch: (search) => set({ search }),
  setCategories: (categories) => set({ categories }),
  toggleCategory: (category) => set((state) => ({ categories: toggleValue(state.categories, category) })),
  setPriceRange: (priceRange) => set({ priceRange }),
  setMaterials: (materials) => set({ materials }),
  toggleMaterial: (material) => set((state) => ({ materials: toggleValue(state.materials, material) })),
  setSizes: (sizes) => set({ sizes }),
  toggleSize: (size) => set((state) => ({ sizes: toggleValue(state.sizes, size) })),
  setStyles: (styles) => set({ styles }),
  toggleStyle: (style) => set((state) => ({ styles: toggleValue(state.styles, style) })),
  setOccasions: (occasions) => set({ occasions }),
  toggleOccasion: (occasion) => set((state) => ({ occasions: toggleValue(state.occasions, occasion) })),
  setStatuses: (statuses) => set({ statuses }),
  toggleStatus: (status) => set((state) => ({ statuses: toggleValue(state.statuses, status) })),
  setSort: (sort) => set({ sort }),
  resetFilters: () => set(initial),
  removeFilter: (group, value) => set((state) => ({ [group]: state[group].filter((item) => item !== value) })),
}));
