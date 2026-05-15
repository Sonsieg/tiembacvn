import type { Metadata } from "next";
import Link from "next/link";
import { JournalSearchForm } from "@/components/blog/journal-search-form";
import { getBlogPosts } from "@/lib/services/blog.service";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Journal trang sức bạc",
  description: "Cẩm nang chọn, đeo và bảo quản trang sức bạc S925 từ Tiembac.vn.",
};

type Props = { searchParams?: Promise<{ q?: string; topic?: string; page?: string }> };

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
        <JournalSearchForm query={query} topic={topic} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <Link key={post.id} href={`/journal/${post.slug}`} className="overflow-hidden rounded-[1.5rem] bg-white shadow-soft">
              <img src={post.coverImage} alt={post.title} className="aspect-[16/10] w-full object-cover" />
              <div className="p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-cta">{formatDate(post.publishedAt)}</p><h2 className="mt-2 text-xl font-semibold text-ink">{post.title}</h2><p className="mt-2 text-sm text-gray-500">{post.excerpt}</p></div>
            </Link>
          ))}
        </div>
        {!visiblePosts.length ? <div className="rounded-sm border border-line bg-white p-8 text-center text-sm text-gray-500 shadow-soft">Không có bài viết phù hợp.</div> : null}
        <JournalPagination query={query} topic={topic} page={safePage} totalPages={totalPages} totalItems={filtered.length} pageSize={pageSize} />
      </div>
    </section>
  );
}

function JournalPagination({ query, topic, page, totalPages, totalItems, pageSize }: { query: string; topic: string; page: number; totalPages: number; totalItems: number; pageSize: number }) {
  const start = totalItems ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="mt-8 grid gap-4 border-t border-line pt-8">
      <p className="text-center text-xs font-bold uppercase tracking-[.16em] text-slate-muted">Hiển thị {start} - {end} / {totalItems} bài viết</p>
      <nav className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[.18em] text-slate-muted" aria-label="Phân trang bài viết">
        <Link className="hover:text-cta aria-disabled:pointer-events-none aria-disabled:opacity-40" aria-disabled={page === 1} href={journalHref({ q: query, topic, page: Math.max(1, page - 1) })}>Trước</Link>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
          <Link key={item} href={journalHref({ q: query, topic, page: item })} className={item === page ? "text-cta" : "hover:text-slate"}>
            {String(item).padStart(2, "0")}
          </Link>
        ))}
        <Link className="hover:text-cta aria-disabled:pointer-events-none aria-disabled:opacity-40" aria-disabled={page === totalPages} href={journalHref({ q: query, topic, page: Math.min(totalPages, page + 1) })}>Tiếp</Link>
      </nav>
    </div>
  );
}
