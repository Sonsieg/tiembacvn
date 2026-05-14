import { blogPosts } from "@/data/mock-blog";
import { hasSupabaseEnv, supabase } from "@/lib/supabase/client";
import { mapBlogPost } from "@/lib/services/supabase-mappers";

export async function getBlogPosts() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("status", "published").order("published_at", { ascending: false });
    if (!error && data?.length) return data.map(mapBlogPost);
  }
  return blogPosts.filter((post) => post.status === "published").sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getAdminBlogPosts() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false, nullsFirst: false });
    if (!error && data?.length) return data.map(mapBlogPost);
  }
  return [...blogPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
