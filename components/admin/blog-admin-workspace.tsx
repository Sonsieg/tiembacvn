"use client";

import { Edit3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/types/commerce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { formatDate, slugify } from "@/lib/utils/format";

function toStatusLabel(status: BlogPost["status"]) {
  return status === "published" ? "Active" : "Inactive";
}

export function BlogAdminWorkspace({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(posts[0] ?? null);
  const filtered = useMemo(() => posts.filter((post) => `${post.title} ${post.slug} ${post.seoTitle} ${post.seoDescription}`.toLowerCase().includes(query.toLowerCase())), [posts, query]);
  const draftSlug = selected ? selected.slug : "slug-tu-dong";

  return (
    <div className="grid gap-5">
      <div>
        <p className="eyebrow">Blog SEO</p>
        <h1 className="admin-display-title">Bài viết chuẩn SEO</h1>
        <p className="mt-2 text-sm text-gray-500">Quản lý nội dung journal, trạng thái index và cấu trúc bài viết hỗ trợ SEO.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Tổng bài</p><b className="mt-2 block text-2xl text-ink">{posts.length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Active</p><b className="mt-2 block text-2xl text-success">{posts.filter((post) => post.status === "published").length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Inactive</p><b className="mt-2 block text-2xl text-danger">{posts.filter((post) => post.status !== "published").length}</b></section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="admin-table-card overflow-x-auto">
          <div className="border-b border-line p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
              <Input className="!pl-12" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tiêu đề, slug, từ khóa..." />
            </div>
          </div>
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead><tr><th className="p-4">Bài viết</th><th>Slug</th><th>SEO description</th><th>Trạng thái</th><th>Ngày đăng</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-t border-silver-200">
                  <td className="p-4"><b className="block text-ink">{post.title}</b><span className="mt-1 block max-w-sm truncate text-slate-muted">{post.excerpt}</span></td>
                  <td className="max-w-xs truncate text-slate-muted">{post.slug}</td>
                  <td className="max-w-sm truncate">{post.seoDescription}</td>
                  <td><Badge className={post.status === "published" ? "border-success/25 bg-success/10 text-success" : "border-danger/25 bg-danger/10 text-danger"}>{toStatusLabel(post.status)}</Badge></td>
                  <td>{formatDate(post.publishedAt)}</td>
                  <td><Button type="button" variant="secondary" size="sm" onClick={() => setSelected(post)}><Edit3 className="h-4 w-4" /> Sửa</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length ? <div className="border-t border-line p-8 text-center text-sm text-slate-muted">Không có bài viết phù hợp.</div> : null}
        </section>

        <form key={selected?.id ?? "new"} className="admin-panel grid h-fit gap-4">
          <h2 className="text-lg font-semibold text-ink">Soạn / sửa bài</h2>
          <Field label="Tên bài"><Input defaultValue={selected?.title ?? ""} placeholder="Cách chọn size nhẫn bạc chuẩn tại nhà" /></Field>
          <Field label="Từ khóa SEO"><Input defaultValue={selected ? selected.seoTitle.replace(" | Tiembac.vn", "") : ""} placeholder="size nhẫn bạc, đo size nhẫn" /></Field>
          <Field label="Nội dung"><Textarea rows={14} defaultValue={selected?.content.map((paragraph, index) => index === 0 ? `# ${selected.title}\n\n${paragraph}` : paragraph).join("\n\n## ")} placeholder={"# H1 tiêu đề bài\n\n## H2 ý chính\nNội dung đoạn văn và [link nội bộ](/collections/nhan-bac)."} /></Field>
          <Field label="Trạng thái"><Select defaultValue={selected?.status === "published" ? "active" : "inactive"}><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
          <div className="grid gap-2 rounded-sm border border-line bg-ivory-soft p-4 text-sm">
            <div className="flex justify-between gap-3"><span className="text-slate-muted">Slug</span><b className="truncate text-ink">{selected ? draftSlug : slugify("Tên bài")}</b></div>
            <div className="flex justify-between gap-3"><span className="text-slate-muted">Meta title</span><b className="truncate text-ink">{selected?.seoTitle ?? "Tên bài | Tiembac.vn"}</b></div>
          </div>
          <Button type="button">Lưu bài viết</Button>
        </form>
      </div>
    </div>
  );
}
