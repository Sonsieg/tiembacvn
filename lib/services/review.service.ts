import { reviews } from "@/data/mock-reviews";
import { hasSupabaseEnv, supabase } from "@/lib/supabase/client";
import { mapReview } from "@/lib/services/supabase-mappers";

export async function getProductReviews(productId: string) {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("reviews").select("*").eq("product_id", productId).eq("approved", true).order("created_at", { ascending: false });
    if (!error && data?.length) return data.map(mapReview);
  }
  return reviews.filter((review) => review.productId === productId && review.approved);
}

export async function getApprovedReviews() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false });
    if (!error && data?.length) return data.map(mapReview);
  }
  return reviews.filter((review) => review.approved);
}
