import { blogPosts } from "@/data/mock-blog";
import { hasSupabaseEnv, supabase } from "@/lib/supabase/client";
import { mapBlogPost } from "@/lib/services/supabase-mappers";

export async function getBlogPosts() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("status", "published").order("published_at", { ascending: false });
    if (!error && data?.length) return data.map(mapBlogPost);
  }
  return blogPosts.filter((post) => post.status === "published");
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
