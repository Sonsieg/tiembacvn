import { BlogAdminWorkspace } from "@/components/admin/blog-admin-workspace";
import { getAdminBlogPosts } from "@/lib/services/blog.service";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();
  return <BlogAdminWorkspace posts={posts} />;
}
