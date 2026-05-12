import { getBlogPosts } from "@/lib/services/blog.service";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Blog SEO</p><h1 className="text-2xl font-semibold text-ink">Bài viết chuẩn SEO</h1><p className="mt-2 text-sm text-gray-500">Viết bài theo cụm từ khóa, có meta title/description, cover image và CTA sang sản phẩm.</p></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] bg-white p-4 shadow-soft"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr><th className="p-3">Title</th><th>Slug</th><th>SEO description</th><th>Status</th></tr></thead><tbody>{posts.map((post) => <tr key={post.id} className="border-t border-silver-200"><td className="p-3">{post.title}</td><td>{post.slug}</td><td>{post.seoDescription}</td><td>{post.status}</td></tr>)}</tbody></table></div>
        <form className="grid h-fit gap-4 rounded-[2rem] bg-white p-5 shadow-soft"><h2 className="font-semibold text-ink">Soạn bài nhanh</h2><Field label="Tiêu đề"><Input placeholder="Cách chọn size nhẫn bạc..." /></Field><Field label="Slug"><Input readOnly placeholder="cach-chon-size-nhan-bac" /></Field><Field label="Từ khóa chính"><Input placeholder="size nhẫn bạc" /></Field><Field label="SEO title"><Input /></Field><Field label="SEO description"><Textarea /></Field><Field label="Nội dung"><Textarea rows={10} placeholder="Mở bài, H2, H3, CTA..." /></Field><Field label="Trạng thái"><Select><option>draft</option><option>published</option></Select></Field><Button type="button">Lưu bài viết</Button></form>
      </div>
    </div>
  );
}
