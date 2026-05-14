import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/services/blog.service";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Journal trang sức bạc",
  description: "Cẩm nang chọn, đeo và bảo quản trang sức bạc S925 từ Tiembac.vn.",
};

type Props = { searchParams?: Promise<{ q?: string; topic?: string; page?: string }> };

const topicOptions = [
  ["all", "Tất cả"],
  ["size", "Chọn size"],
  ["care", "Bảo quản"],
  ["material", "Chất liệu"],
  ["gift", "Quà tặng"],
];

function topicOf(post: { title: string; slug: string; excerpt: string }) {
  const text = `${post.title} ${post.slug} ${post.excerpt}`.toLowerCase();
  if (text.includes("size")) return "size";
  if (text.includes("bảo quản") || text.includes("bao-quan") || text.includes("đen") || text.includes("xỉn")) return "care";
  if (text.includes("s925") || text.includes("chất liệu")) return "material";
  if (text.includes("quà") || text.includes("qua-tang")) return "gift";
  return "all";
}

function journalHref(params: { q: string; topic: string; page: number }) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.topic !== "all") query.set("topic", params.topic);
  if (params.page > 1) query.set("page", String(params.page));
  const value = query.toString();
  return value ? `/journal?${value}` : "/journal";
}

export default async function JournalPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = (params?.q ?? "").trim();
  const topic = params?.topic ?? "all";
  const page = Math.max(1, Number(params?.page ?? "1") || 1);
  const posts = await getBlogPosts();
  const filtered = posts.filter((post) => {
    const searchMatch = !query || `${post.title} ${post.excerpt} ${post.seoTitle} ${post.seoDescription}`.toLowerCase().includes(query.toLowerCase());
    const topicMatch = topic === "all" || topicOf(post) === topic;
    return searchMatch && topicMatch;
  });
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visiblePosts = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <section className="section">
      <div className="container-page grid gap-8">
        <div><p className="eyebrow">Journal</p><h1 className="heading-lg">Cẩm nang trang sức bạc</h1></div>
        <form className="grid gap-3 rounded-sm border border-line bg-white p-4 shadow-soft md:grid-cols-[1fr_220px_auto]">
          <input className="h-11 rounded-sm border border-input-border px-4 text-sm outline-none focus:border-cta focus:ring-2 focus:ring-cta/20" name="q" defaultValue={query} placeholder="Tìm bài viết..." />
          <select className="h-11 rounded-sm border border-input-border px-4 text-sm outline-none focus:border-cta focus:ring-2 focus:ring-cta/20" name="topic" defaultValue={topic}>
            {topicOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button className="inline-flex h-11 items-center justify-center rounded-sm border border-cta bg-cta px-5 text-sm font-bold uppercase tracking-[.12em] text-cta-text" type="submit">Tìm kiếm</button>
        </form>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <Link key={post.id} href={`/journal/${post.slug}`} className="overflow-hidden rounded-[1.5rem] bg-white shadow-soft">
              <img src={post.coverImage} alt={post.title} className="aspect-[16/10] w-full object-cover" />
              <div className="p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-cta">{formatDate(post.publishedAt)}</p><h2 className="mt-2 text-xl font-semibold text-ink">{post.title}</h2><p className="mt-2 text-sm text-gray-500">{post.excerpt}</p></div>
            </Link>
          ))}
        </div>
        {!visiblePosts.length ? <div className="rounded-sm border border-line bg-white p-8 text-center text-sm text-gray-500 shadow-soft">Không có bài viết phù hợp.</div> : null}
        {filtered.length > pageSize ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">Hiển thị {(safePage - 1) * pageSize + 1} - {Math.min(safePage * pageSize, filtered.length)} / {filtered.length} bài viết</p>
            <div className="flex items-center gap-2">
              <Link className="rounded-sm border border-line bg-white px-4 py-2 text-sm font-bold text-ink shadow-soft aria-disabled:pointer-events-none aria-disabled:opacity-50" aria-disabled={safePage === 1} href={journalHref({ q: query, topic, page: Math.max(1, safePage - 1) })}>Trước</Link>
              <span className="text-sm font-semibold text-ink">{safePage} / {totalPages}</span>
              <Link className="rounded-sm border border-line bg-white px-4 py-2 text-sm font-bold text-ink shadow-soft aria-disabled:pointer-events-none aria-disabled:opacity-50" aria-disabled={safePage === totalPages} href={journalHref({ q: query, topic, page: Math.min(totalPages, safePage + 1) })}>Sau</Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
