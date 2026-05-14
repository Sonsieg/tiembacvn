import { videos } from "@/data/mock-videos";
import { hasSupabaseEnv, supabase } from "@/lib/supabase/client";
import { mapVideo } from "@/lib/services/supabase-mappers";

export async function getAdminProductVideos() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("product_videos").select("*").order("sort_order");
    if (!error && data) return data.map(mapVideo);
  }
  return videos.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProductVideos(productId: string) {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("product_videos").select("*").eq("product_id", productId).eq("status", "active").order("sort_order");
    if (!error && data) return data.map(mapVideo);
  }
  return videos
    .filter((video) => video.productId === productId && video.status === "active")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFeaturedVideos() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("product_videos").select("*").eq("status", "active").eq("featured", true).order("sort_order");
    if (!error && data?.length) return data.map(mapVideo);
  }
  return videos.filter((video) => video.status === "active" && video.featured);
}
