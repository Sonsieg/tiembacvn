"use client";

import { CheckCircle, Edit3, Eye, Heading2, Italic, Link as LinkIcon, List, Plus, Search, Trash2, Type, Unlink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import type { BlogPost } from "@/types/commerce";
import { AdminModal, ConfirmDialog } from "@/components/admin/shared/admin-overlays";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatDate, slugify } from "@/lib/utils/format";

type BlogDraft = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
  status: BlogPost["status"];
};

const emptyDraft: BlogDraft = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  contentHtml: "",
  seoTitle: "",
  seoDescription: "",
  status: "draft",
};

export function BlogAdminWorkspace({ posts }: { posts: BlogPost[] }) {
  const toast = useToast();
  const [items, setItems] = useState(posts);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<BlogDraft>(emptyDraft);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [statusTarget, setStatusTarget] = useState<BlogPost | null>(null);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return items.filter((post) => `${post.title} ${post.slug} ${post.excerpt} ${post.seoTitle} ${post.seoDescription}`.toLowerCase().includes(needle));
  }, [items, query]);

  function openCreate() {
    setDraft(emptyDraft);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(post: BlogPost) {
    setDraft({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      contentHtml: postToHtml(post),
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      status: post.status,
    });
    setFormError("");
    setModalOpen(true);
  }

  function updateDraft<K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !current.id) {
        next.slug = slugify(String(value));
        next.seoTitle = String(value);
      }
      return next;
    });
  }

  async function savePost() {
    const payload = { ...draft };
    if (!payload.title.trim() || !payload.slug.trim() || !payload.excerpt.trim() || !payload.coverImage.trim() || !stripHtml(payload.contentHtml).trim()) {
      setFormError("Vui lòng nhập đủ Tên bài, Mô tả, Ảnh URL, slug và nội dung.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const response = await fetch("/api/admin/blog", {
        method: payload.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không thể lưu bài viết");
      setItems((current) => payload.id ? current.map((post) => post.id === payload.id ? data.post : post) : [data.post, ...current]);
      toast({ tone: "success", title: payload.id ? "Đã cập nhật bài viết" : "Đã tạo bài viết", description: data.post.title });
      setModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể lưu bài viết";
      setFormError(message);
      toast({ tone: "danger", title: "Lưu bài thất bại", description: message });
    } finally {
      setSaving(false);
    }
  }

  async function confirmStatusToggle() {
    if (!statusTarget) return;
    const nextStatus: BlogPost["status"] = statusTarget.status === "published" ? "draft" : "published";
    try {
      const response = await fetch("/api/admin/blog/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: statusTarget.id, status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không thể cập nhật bài viết");
      setItems((current) => current.map((post) => post.id === statusTarget.id ? { ...post, status: nextStatus, publishedAt: nextStatus === "published" ? new Date().toISOString() : post.publishedAt } : post));
      toast({ tone: "success", title: nextStatus === "published" ? "Đã đăng bài" : "Đã chuyển nháp", description: statusTarget.title });
      setStatusTarget(null);
    } catch (error) {
      toast({ tone: "danger", title: "Cập nhật thất bại", description: error instanceof Error ? error.message : "Không thể cập nhật bài viết" });
    }
  }

  const canSave = Boolean(draft.title.trim() && draft.slug.trim() && draft.excerpt.trim() && draft.coverImage.trim() && draft.seoTitle.trim() && stripHtml(draft.contentHtml).trim()) && !saving;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Blog CMS</p>
          <h1 className="admin-display-title">Quản lý bài viết</h1>
          <p className="mt-2 text-sm text-gray-500">Tạo, sửa, đăng bài journal bằng modal soạn thảo HTML kiểu WordPress.</p>
        </div>
        <Button type="button" onClick={openCreate}><Plus className="h-4 w-4" /> Thêm bài viết</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Tổng bài</p><b className="mt-2 block text-2xl text-ink">{items.length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Đã đăng</p><b className="mt-2 block text-2xl text-success">{items.filter((post) => post.status === "published").length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Bản nháp</p><b className="mt-2 block text-2xl text-warning">{items.filter((post) => post.status !== "published").length}</b></section>
      </div>

      <section className="admin-table-card overflow-x-auto">
        <div className="border-b border-line p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <Input className="!pl-12" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tiêu đề, slug, mô tả..." />
          </div>
        </div>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead><tr><th className="p-4">Tên bài</th><th>Ảnh</th><th>Trạng thái</th><th>Ngày đăng</th><th>Thao tác</th></tr></thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post.id} className="border-t border-silver-200">
                <td className="p-4"><b className="block text-ink">{post.title}</b><span className="mt-1 block max-w-md truncate text-slate-muted">{post.excerpt}</span></td>
                <td><img src={post.coverImage} alt="" className="h-14 w-20 rounded-sm object-cover" /></td>
                <td><Badge className={post.status === "published" ? "border-success/25 bg-success/10 text-success" : "border-warning/25 bg-warning/10 text-warning"}>{post.status === "published" ? "Đã đăng" : "Bản nháp"}</Badge></td>
                <td>{post.publishedAt ? formatDate(post.publishedAt) : "Chưa đăng"}</td>
                <td>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(post)}><Edit3 className="h-4 w-4" /> Sửa</Button>
                    <Button type="button" variant="secondary" size="sm" onClick={() => window.open(`/journal/${post.slug}`, "_blank")}><Eye className="h-4 w-4" /> Xem</Button>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setStatusTarget(post)}>
                      {post.status === "published" ? <Trash2 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      {post.status === "published" ? "Nháp" : "Đăng"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length ? <div className="border-t border-line p-8 text-center text-sm text-slate-muted">Không có bài viết phù hợp.</div> : null}
      </section>

      <AdminModal open={modalOpen} title={draft.id ? "Sửa bài viết" : "Thêm bài viết"} onClose={() => setModalOpen(false)} width="max-w-6xl">
        <div className="grid max-h-[78vh] gap-5 overflow-y-auto">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-4">
              <Field label="Tên bài" required><Input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} placeholder="Cách chọn size nhẫn bạc chuẩn tại nhà" /></Field>
              <Field label="Mô tả" required><Textarea rows={3} value={draft.excerpt} onChange={(event) => updateDraft("excerpt", event.target.value)} placeholder="Mô tả ngắn hiển thị dưới title và ở danh sách bài viết." /></Field>
              <Field label="Content" required>
                <BlogContentEditor value={draft.contentHtml} onChange={(contentHtml) => updateDraft("contentHtml", contentHtml)} />
              </Field>
            </div>

            <aside className="grid h-fit gap-4 rounded-sm border border-line bg-ivory-soft p-4">
              <Field label="Meta title" required><Input value={draft.seoTitle} onChange={(event) => updateDraft("seoTitle", event.target.value)} /></Field>
              <Field label="Ảnh URL" required><Input value={draft.coverImage} onChange={(event) => updateDraft("coverImage", event.target.value)} placeholder="https://..." /></Field>
              {draft.coverImage ? <img src={draft.coverImage} alt="" className="aspect-video w-full rounded-sm border border-line object-cover" /> : null}
              <Field label="Slug" required hint="Tự tạo theo tên bài, vẫn có thể sửa thủ công."><Input value={draft.slug} onChange={(event) => updateDraft("slug", slugify(event.target.value))} /></Field>
              <Field label="Meta description"><Textarea rows={4} value={draft.seoDescription} onChange={(event) => updateDraft("seoDescription", event.target.value)} /></Field>
              <label className="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate">
                <span>Đăng bài ngay</span>
                <span className="relative">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={draft.status === "published"}
                    onChange={(event) => updateDraft("status", event.target.checked ? "published" : "draft")}
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-cta peer-focus-visible:ring-2 peer-focus-visible:ring-cta peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ivory-soft" />
                  <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-5" />
                </span>
              </label>
            </aside>
          </div>
          {formError ? <div className="rounded-sm border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{formError}</div> : null}
          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-line bg-drawer-footer/95 py-4 backdrop-blur">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button type="button" onClick={savePost} disabled={!canSave}>{saving ? "Đang lưu..." : draft.status === "published" ? "Lưu & đăng bài" : "Lưu bản nháp"}</Button>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.status === "published" ? "Chuyển về bản nháp?" : "Đăng bài viết?"}
        description={statusTarget?.status === "published" ? `Bài "${statusTarget.title}" sẽ không còn hiển thị ở Journal.` : `Bài "${statusTarget?.title ?? ""}" sẽ được hiển thị ở Journal.`}
        confirmLabel={statusTarget?.status === "published" ? "Chuyển nháp" : "Đăng bài"}
        onConfirm={confirmStatusToggle}
        onClose={() => setStatusTarget(null)}
      />
    </div>
  );
}

function BlogContentEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class: "font-semibold text-cta underline underline-offset-4 hover:text-navy",
        },
      }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "prose prose-lg min-h-[360px] max-w-none p-4 text-slate outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "<p></p>";
    if (current !== next) editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  function openLinkPopup() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl ?? "");
    setLinkError(editor.state.selection.empty && !previousUrl ? "Hãy bôi đen đoạn text cần gắn link trước." : "");
    setLinkOpen(true);
  }

  function applyLink() {
    if (!editor) return;
    const href = normalizeUrl(linkUrl);
    if (!href) {
      setLinkError("Vui lòng nhập URL hợp lệ.");
      return;
    }
    if (editor.state.selection.empty && !editor.isActive("link")) {
      setLinkError("Hãy bôi đen đoạn text cần gắn link trước.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href, target: "_blank", rel: "noopener noreferrer" }).run();
    onChange(editor.getHTML());
    setLinkOpen(false);
    setLinkError("");
  }

  function removeLink() {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onChange(editor.getHTML());
    setLinkOpen(false);
    setLinkError("");
  }

  return (
    <div className="overflow-hidden rounded-sm border border-line bg-white">
      <div className="relative flex flex-wrap gap-1 border-b border-line bg-ivory-soft p-2">
        <ToolbarButton label="Đoạn" icon={<Type className="h-4 w-4" />} disabled={!editor} active={editor?.isActive("paragraph")} onClick={() => editor?.chain().focus().setParagraph().run()} />
        <ToolbarButton label="H2" icon={<Heading2 className="h-4 w-4" />} disabled={!editor} active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolbarButton label="Đậm" text="B" disabled={!editor} active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()} />
        <ToolbarButton label="Nghiêng" icon={<Italic className="h-4 w-4" />} disabled={!editor} active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()} />
        <ToolbarButton label="Danh sách" icon={<List className="h-4 w-4" />} disabled={!editor} active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
        <ToolbarButton label="Gắn link" icon={<LinkIcon className="h-4 w-4" />} disabled={!editor} active={editor?.isActive("link")} onClick={openLinkPopup} />
        <ToolbarButton label="Gỡ link" icon={<Unlink className="h-4 w-4" />} disabled={!editor || !editor.isActive("link")} onClick={removeLink} />
        {linkOpen ? (
          <div className="absolute left-2 top-12 z-10 grid w-[min(360px,calc(100vw-3rem))] gap-3 rounded-sm border border-line bg-white p-3 shadow-premium">
            <label className="grid gap-2 text-sm font-medium text-slate">
              <span className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">URL link</span>
              <Input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://google.com" autoFocus onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
                if (event.key === "Escape") setLinkOpen(false);
              }} />
              {linkError ? <span className="text-xs font-normal text-danger">{linkError}</span> : null}
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setLinkOpen(false)}>Hủy</Button>
              <Button type="button" size="sm" onClick={applyLink}>Gắn link</Button>
            </div>
          </div>
        ) : null}
      </div>
      <EditorContent editor={editor} className="[&_.ProseMirror_a]:font-semibold [&_.ProseMirror_a]:text-cta [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-4 [&_.ProseMirror_a]:hover:text-navy" />
    </div>
  );
}

function ToolbarButton({ label, icon, text, active, disabled, onClick }: { label: string; icon?: ReactNode; text?: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-sm border px-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border-cta bg-cta text-navy" : "border-line bg-white text-slate hover:border-cta hover:text-navy"}`}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {icon ?? text}
    </button>
  );
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return "";
  return `https://${trimmed}`;
}

function postToHtml(post: BlogPost) {
  if (post.content.length === 1 && /<\/?[a-z][\s\S]*>/i.test(post.content[0])) return post.content[0];
  return post.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
