"use client";

import { CheckCircle, Edit3, Search, Sparkles, Trash2, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/types/commerce";
import { AdminDropdown } from "@/components/admin/admin-dropdown";
import { AdminModal, ConfirmDialog } from "@/components/admin/shared/admin-overlays";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatDate, slugify } from "@/lib/utils/format";

type SeoDraft = {
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  tags: string[];
  categories: string[];
  featuredImage: string;
  featuredImagePrompt: string;
  content: string;
  faq: { question: string; answer: string }[];
  internalLinkSuggestions: string[];
  backlinkSuggestions: string[];
  schema: string;
  status: "active" | "inactive";
};

function toStatusLabel(status: BlogPost["status"]) {
  return status === "published" ? "Active" : "Inactive";
}

function createDraft(post?: BlogPost | null): SeoDraft {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    metaTitle: post?.seoTitle ?? "",
    metaDescription: post?.seoDescription ?? "",
    focusKeyword: "",
    secondaryKeywords: [],
    tags: [],
    categories: [],
    featuredImage: post?.coverImage ?? "",
    featuredImagePrompt: "",
    content: post ? post.content.map((paragraph, index) => index === 0 ? `# ${post.title}\n\n${paragraph}` : paragraph).join("\n\n") : "",
    faq: [],
    internalLinkSuggestions: [],
    backlinkSuggestions: [],
    schema: "{}",
    status: post?.status === "published" ? "active" : "inactive",
  };
}

export function BlogAdminWorkspace({ posts }: { posts: BlogPost[] }) {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BlogPost | null>(posts[0] ?? null);
  const [draft, setDraft] = useState<SeoDraft>(() => createDraft(posts[0] ?? null));
  const [promptOpen, setPromptOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [statusTarget, setStatusTarget] = useState<BlogPost | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, BlogPost["status"]>>({});
  const [statusError, setStatusError] = useState("");
  const [updating, setUpdating] = useState(false);

  const displayedPosts = useMemo(() => posts.map((post) => statusOverrides[post.id] ? { ...post, status: statusOverrides[post.id] } : post), [posts, statusOverrides]);
  const filtered = useMemo(() => displayedPosts.filter((post) => `${post.title} ${post.slug} ${post.seoTitle} ${post.seoDescription}`.toLowerCase().includes(query.toLowerCase())), [displayedPosts, query]);

  function editPost(post: BlogPost) {
    setSelected(post);
    setDraft(createDraft(post));
  }

  function updateDraft<K extends keyof SeoDraft>(key: K, value: SeoDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function applyGeneratedJson() {
    setJsonError("");
    try {
      const parsed = JSON.parse(jsonInput);
      setDraft({
        title: String(parsed.title ?? ""),
        slug: String(parsed.slug ?? slugify(String(parsed.title ?? ""))),
        excerpt: String(parsed.excerpt ?? ""),
        metaTitle: String(parsed.metaTitle ?? parsed.title ?? ""),
        metaDescription: String(parsed.metaDescription ?? ""),
        focusKeyword: String(parsed.focusKeyword ?? ""),
        secondaryKeywords: Array.isArray(parsed.secondaryKeywords) ? parsed.secondaryKeywords.map(String) : [],
        tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
        categories: Array.isArray(parsed.categories) ? parsed.categories.map(String) : [],
        featuredImage: draft.featuredImage,
        featuredImagePrompt: String(parsed.featuredImagePrompt ?? ""),
        content: String(parsed.content ?? ""),
        faq: Array.isArray(parsed.faq) ? parsed.faq.map((item: { question?: unknown; answer?: unknown }) => ({ question: String(item.question ?? ""), answer: String(item.answer ?? "") })) : [],
        internalLinkSuggestions: Array.isArray(parsed.internalLinkSuggestions) ? parsed.internalLinkSuggestions.map(String) : [],
        backlinkSuggestions: Array.isArray(parsed.backlinkSuggestions) ? parsed.backlinkSuggestions.map(String) : [],
        schema: JSON.stringify(parsed.schema ?? { "@context": "https://schema.org", "@type": "Article" }, null, 2),
        status: "inactive",
      });
      setSelected(null);
      setPromptOpen(false);
      setJsonInput("");
      toast({ tone: "success", title: "Đã áp dụng bản nháp SEO", description: "JSON đã được nạp vào form soạn bài." });
    } catch {
      const message = "JSON không hợp lệ. Hãy dán đúng output JSON từ prompt SEO.";
      setJsonError(message);
      toast({ tone: "danger", title: "Không đọc được JSON", description: message });
    }
  }

  async function confirmStatusToggle() {
    if (!statusTarget) return;
    setUpdating(true);
    setStatusError("");
    const nextStatus: BlogPost["status"] = statusTarget.status === "published" ? "draft" : "published";

    try {
      const response = await fetch("/api/admin/blog/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: statusTarget.id, status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không thể cập nhật bài viết");
      setStatusOverrides((current) => ({ ...current, [statusTarget.id]: nextStatus }));
      toast({
        tone: "success",
        title: nextStatus === "published" ? "Đã active bài viết" : "Đã inactive bài viết",
        description: statusTarget.title,
      });
      setStatusTarget(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể cập nhật bài viết";
      setStatusError(message);
      toast({ tone: "danger", title: "Cập nhật bài viết thất bại", description: message });
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Blog SEO</p>
          <h1 className="admin-display-title">Bài viết chuẩn SEO</h1>
          <p className="mt-2 text-sm text-gray-500">Soạn bài journal, tối ưu meta, keyword, FAQ, schema và trạng thái index.</p>
        </div>
        <Button type="button" onClick={() => setPromptOpen(true)}><Sparkles className="h-4 w-4" /> Tạo bằng SEO prompt</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Tổng bài</p><b className="mt-2 block text-2xl text-ink">{displayedPosts.length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Active</p><b className="mt-2 block text-2xl text-success">{displayedPosts.filter((post) => post.status === "published").length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Inactive</p><b className="mt-2 block text-2xl text-danger">{displayedPosts.filter((post) => post.status !== "published").length}</b></section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_460px]">
        <section className="admin-table-card overflow-x-auto">
          <div className="border-b border-line p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
              <Input className="!pl-12" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tiêu đề, slug, từ khóa..." />
            </div>
          </div>
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead><tr><th className="p-4">Bài viết</th><th>Slug</th><th>Meta description</th><th>Trạng thái</th><th>Ngày đăng</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-t border-silver-200">
                  <td className="p-4"><b className="block text-ink">{post.title}</b><span className="mt-1 block max-w-sm truncate text-slate-muted">{post.excerpt}</span></td>
                  <td className="max-w-xs truncate text-slate-muted">{post.slug}</td>
                  <td className="max-w-sm truncate">{post.seoDescription}</td>
                  <td><Badge className={post.status === "published" ? "border-success/25 bg-success/10 text-success" : "border-danger/25 bg-danger/10 text-danger"}>{toStatusLabel(post.status)}</Badge></td>
                  <td>{formatDate(post.publishedAt)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" size="sm" onClick={() => editPost(post)}><Edit3 className="h-4 w-4" /> Sửa</Button>
                      <Button type="button" variant="secondary" size="sm" onClick={() => setStatusTarget(post)}>
                        {post.status === "published" ? <Trash2 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        {post.status === "published" ? "Inactive" : "Active"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length ? <div className="border-t border-line p-8 text-center text-sm text-slate-muted">Không có bài viết phù hợp.</div> : null}
        </section>

        <form className="admin-panel grid h-fit gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">{selected ? "Soạn / sửa bài" : "Bản nháp SEO mới"}</h2>
            <p className="mt-1 text-sm text-slate-muted">Các trường này phục vụ publish chuẩn SEO: title, slug, meta, keyword, content, FAQ và schema.</p>
          </div>
          <Field label="Tên bài"><Input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} placeholder="Cách chọn size nhẫn bạc chuẩn tại nhà" /></Field>
          <Field label="Slug"><Input value={draft.slug} onChange={(event) => updateDraft("slug", slugify(event.target.value))} placeholder="cach-chon-size-nhan-bac" /></Field>
          <Field label="Excerpt"><Textarea rows={3} value={draft.excerpt} onChange={(event) => updateDraft("excerpt", event.target.value)} /></Field>
          <Field label="Meta title"><Input value={draft.metaTitle} onChange={(event) => updateDraft("metaTitle", event.target.value)} /></Field>
          <Field label="Meta description"><Textarea rows={3} value={draft.metaDescription} onChange={(event) => updateDraft("metaDescription", event.target.value)} /></Field>
          <Field label="Focus keyword"><Input value={draft.focusKeyword} onChange={(event) => updateDraft("focusKeyword", event.target.value)} placeholder="nhẫn bạc nữ" /></Field>
          <Field label="Tags"><Input value={draft.tags.join(", ")} onChange={(event) => updateDraft("tags", splitCsv(event.target.value))} placeholder="nhẫn bạc, bạc S925, quà tặng" /></Field>
          <Field label="Categories"><Input value={draft.categories.join(", ")} onChange={(event) => updateDraft("categories", splitCsv(event.target.value))} placeholder="Hướng dẫn, Trang sức bạc" /></Field>
          <Field label="Featured image">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-line bg-ivory-soft px-4 py-5 text-sm font-semibold text-slate hover:border-cta hover:text-navy">
              <Upload className="h-4 w-4" />
              Upload ảnh đại diện
              <input className="sr-only" type="file" accept="image/*" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) updateDraft("featuredImage", URL.createObjectURL(file));
              }} />
            </label>
          </Field>
          {draft.featuredImage ? <img src={draft.featuredImage} alt="" className="aspect-video w-full rounded-sm border border-line object-cover" /> : null}
          <Field label="Nội dung markdown/html"><Textarea rows={16} value={draft.content} onChange={(event) => updateDraft("content", event.target.value)} placeholder={"# H1 tiêu đề bài\n\n## H2 ý chính\nNội dung và [link nội bộ](/collections/nhan-bac)."} /></Field>
          <Field label="FAQ"><Textarea rows={5} value={draft.faq.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n")} readOnly /></Field>
          <Field label="Schema JSON-LD"><Textarea rows={5} value={draft.schema} onChange={(event) => updateDraft("schema", event.target.value)} /></Field>
          <Field label="Trạng thái">
            <AdminDropdown
              ariaLabel="Trạng thái bài viết"
              value={draft.status}
              onChange={(value) => updateDraft("status", value === "active" ? "active" : "inactive")}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </Field>
          <Button type="button" onClick={() => toast({ tone: "info", title: "Đã lưu bản nháp bài viết", description: "Form blog đang ở UI preview; thao tác active/inactive đã có API ghi database." })}>Lưu bài viết</Button>
        </form>
      </div>

      <AdminModal open={promptOpen} title="Tạo bài bằng SEO prompt" onClose={() => setPromptOpen(false)}>
        <div className="grid max-h-[76vh] gap-4 overflow-y-auto">
          <Field label="Prompt dùng cho AI">
            <Textarea rows={10} readOnly value={SEO_BLOG_PROMPT} />
          </Field>
          <Field label="Dán JSON output">
            <Textarea rows={10} value={jsonInput} onChange={(event) => setJsonInput(event.target.value)} placeholder='{"title":"...","slug":"...","content":"..."}' />
          </Field>
          {jsonError ? <div className="rounded-sm border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{jsonError}</div> : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setPromptOpen(false)}>Đóng</Button>
            <Button type="button" onClick={applyGeneratedJson}>Áp dụng bản nháp</Button>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.status === "published" ? "Inactive bài viết?" : "Active bài viết?"}
        description={statusError || (statusTarget?.status === "published"
          ? `Bài "${statusTarget.title}" sẽ chuyển inactive và không hiển thị ở /journal.`
          : `Bài "${statusTarget?.title ?? ""}" sẽ được active và hiển thị ở /journal.`)}
        confirmLabel={updating ? "Đang lưu..." : statusTarget?.status === "published" ? "Chuyển inactive" : "Chuyển active"}
        onConfirm={confirmStatusToggle}
        onClose={() => { setStatusTarget(null); setStatusError(""); }}
      />
    </div>
  );
}

function splitCsv(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

const SEO_BLOG_PROMPT = `You are an advanced SEO Blog Management AI for a Next.js Admin CMS.

Generate FULLY OPTIMIZED blog posts for modern SEO in 2026 standards.

Return ONLY valid JSON with: title, slug, excerpt, metaTitle, metaDescription, focusKeyword, secondaryKeywords, tags, categories, featuredImagePrompt, toc, content, faq, internalLinkSuggestions, backlinkSuggestions, schema, seoScoreChecklist.

Rules:
- Title max 60 characters, include focus keyword near beginning.
- Meta description 140-160 characters and include focus keyword.
- Slug lowercase, hyphen-separated, short.
- Content in markdown/html, minimum 1500 words, use H1/H2/H3, bullets, tables when useful.
- Optimize for Google SEO, CTR, semantic SEO, EEAT, AI search, rich snippets, long-tail keywords, internal links, readability and featured snippets.
- Add FAQ, internal link suggestions, authority backlink suggestions and valid Article JSON-LD schema.
- Avoid fluff, keyword stuffing and robotic AI wording.
- Output only JSON, no markdown wrapper.`;
