import { categories, collections } from "@/data/mock-categories";
import { products } from "@/data/mock-products";
import { hasSupabaseEnv, supabase } from "@/lib/supabase/client";
import { mapCategory, mapCollection, mapProduct } from "@/lib/services/supabase-mappers";

export async function getProducts() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*), product_variants(*, inventory_items(*)), product_categories(categories(*)), product_collections(collections(*))")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (!error && data?.length) {
      return data.map(mapProduct);
    }
  }
  return products.filter((product) => product.status === "active");
}

export async function getAdminProducts() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*), product_variants(*, inventory_items(*)), product_categories(categories(*)), product_collections(collections(*))")
      .order("created_at", { ascending: false });
    if (!error && data?.length) {
      return data.map(mapProduct);
    }
  }
  return products;
}

export async function getProductBySlug(slug: string) {
  const list = await getProducts();
  return list.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  const list = await getAdminProducts();
  return list.find((product) => product.id === id || product.slug === id) ?? null;
}

export async function getProductsByCategory(slug: string) {
  const list = await getProducts();
  return list.filter((product) => product.categorySlugs.includes(slug));
}

export async function getProductsByCollection(slug: string) {
  const list = await getProducts();
  return list.filter((product) => product.collectionSlugs.includes(slug));
}

export async function getCategories() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("categories").select("*").eq("active", true).order("name");
    if (!error && data?.length) return data.map(mapCategory);
  }
  return categories.filter((category) => category.active);
}

export async function getAdminCategories() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (!error && data?.length) return data.map(mapCategory);
  }
  return categories;
}

export async function getCollections() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("collections").select("*").eq("active", true).order("featured", { ascending: false });
    if (!error && data?.length) return data.map(mapCollection);
  }
  return collections.filter((collection) => collection.active !== false);
}

export async function getAdminCollections() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("collections").select("*").order("featured", { ascending: false });
    if (!error && data?.length) return data.map(mapCollection);
  }
  return collections;
}

export async function getRelatedProducts(productId: string, categorySlugs: string[]) {
  const list = await getProducts();
  return list
    .filter((product) => product.id !== productId && product.categorySlugs.some((slug) => categorySlugs.includes(slug)))
    .slice(0, 4);
}
