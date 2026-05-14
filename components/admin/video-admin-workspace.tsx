"use client";

import { CheckCircle, ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, ProductVideo } from "@/types/commerce";
import { AdminDrawer, ConfirmDialog } from "@/components/admin/shared/admin-overlays";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";

type VideoForm = {
  id?: string;
  productId: string;
  youtubeUrl: string;
  active: boolean;
};

export function VideoAdminWorkspace({ products, videos }: { products: Product[]; videos: ProductVideo[] }) {
  const toast = useToast();
  const [items, setItems] = useState(videos);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<VideoForm | null>(null);
  const [statusTarget, setStatusTarget] = useState<ProductVideo | null>(null);
  const [saving, setSaving] = useState(false);

  const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const filtered = items.filter((video) => {
    const productTitle = productById.get(video.productId)?.title ?? "";
    return `${productTitle} ${video.youtubeUrl}`.toLowerCase().includes(query.toLowerCase());
  });

  function openCreate() {
    setEditing({ productId: products[0]?.id ?? "", youtubeUrl: "", active: true });
  }

  function openEdit(video: ProductVideo) {
    setEditing({ id: video.id, productId: video.productId, youtubeUrl: video.youtubeUrl, active: video.status === "active" });
  }

  async function saveVideo() {
    if (!editing) return;
    setSaving(true);
    const product = productById.get(editing.productId);

    try {
      const response = await fetch("/api/admin/videos", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          productId: editing.productId,
          youtubeUrl: editing.youtubeUrl,
          active: editing.active,
          title: product ? `Review ${product.title}` : "Review sản phẩm",
          sortOrder: items.length + 1,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không thể lưu video");

      const next = toProductVideo(data, editing, product ? `Review ${product.title}` : "Review sản phẩm");
      setItems((current) => editing.id ? current.map((item) => item.id === editing.id ? next : item) : [...current, next]);
      toast({ tone: "success", title: "Đã lưu video", description: product?.title ?? "Video sản phẩm đã được cập nhật." });
      setEditing(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể lưu video";
      toast({ tone: "danger", title: "Lưu thất bại", description: message });
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus() {
    if (!statusTarget) return;
    const product = productById.get(statusTarget.productId);
    const active = statusTarget.status !== "active";
    setSaving(true);

    try {
      const response = await fetch("/api/admin/videos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: statusTarget.id,
          productId: statusTarget.productId,
          youtubeUrl: statusTarget.youtubeUrl,
          active,
          title: statusTarget.title,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không thể cập nhật trạng thái");

      const next = toProductVideo(data, { id: statusTarget.id, productId: statusTarget.productId, youtubeUrl: statusTarget.youtubeUrl, active }, statusTarget.title);
      setItems((current) => current.map((item) => item.id === statusTarget.id ? next : item));
      toast({ tone: "success", title: active ? "Đã active video" : "Đã inactive video", description: product?.title ?? statusTarget.title });
      setStatusTarget(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể cập nhật trạng thái";
      toast({ tone: "danger", title: "Cập nhật thất bại", description: message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Product videos</p>
          <h1 className="admin-display-title">Video sản phẩm</h1>
          <p className="mt-2 text-sm text-gray-500">Gán YouTube review cho từng sản phẩm và bật/tắt hiển thị ở storefront.</p>
        </div>
        <Button type="button" onClick={openCreate} disabled={!products.length}><Plus className="h-4 w-4" /> Thêm video</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Tổng</p><b className="mt-2 block text-2xl text-ink">{items.length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Active</p><b className="mt-2 block text-2xl text-success">{items.filter((item) => item.status === "active").length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Inactive</p><b className="mt-2 block text-2xl text-danger">{items.filter((item) => item.status !== "active").length}</b></section>
      </div>

      <section className="admin-table-card overflow-x-auto">
        <div className="border-b border-line p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <Input className="!pl-12" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo sản phẩm hoặc YouTube URL..." />
          </div>
        </div>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr>
              <th className="p-4">Sản phẩm</th>
              <th>YouTube URL</th>
              <th>Active</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((video) => {
              const product = productById.get(video.productId);
              return (
                <tr key={video.id} className="border-t border-silver-200">
                  <td className="p-4 font-semibold text-ink">{product?.title ?? "Sản phẩm không còn tồn tại"}</td>
                  <td><a className="inline-flex max-w-md items-center gap-2 truncate text-slate-muted hover:text-cta" href={video.youtubeUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 shrink-0" /> {video.youtubeUrl}</a></td>
                  <td><StatusBadge active={video.status === "active"} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button type="button" className="admin-icon-button" onClick={() => openEdit(video)} aria-label="Sửa" title="Sửa"><Pencil className="h-4 w-4" /></button>
                      <button type="button" className="admin-icon-button" onClick={() => setStatusTarget(video)} aria-label={video.status === "active" ? "Inactive" : "Active"} title={video.status === "active" ? "Chuyển inactive" : "Chuyển active"}>
                        {video.status === "active" ? <Trash2 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length ? <div className="border-t border-line p-8 text-center text-sm text-slate-muted">Chưa có video phù hợp.</div> : null}
      </section>

      <AdminDrawer
        open={Boolean(editing)}
        title={editing?.id ? "Sửa video sản phẩm" : "Thêm video sản phẩm"}
        description="Chọn sản phẩm, nhập YouTube URL và quyết định có active ở trang sản phẩm hay không."
        onClose={() => setEditing(null)}
        width="max-w-xl"
        footer={<div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={() => setEditing(null)}>Hủy</Button><Button type="button" onClick={saveVideo} disabled={saving}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</Button></div>}
      >
        {editing ? (
          <div className="admin-panel grid gap-4">
            <Field label="Sản phẩm">
              <Select value={editing.productId} onChange={(event) => setEditing((current) => current ? { ...current, productId: event.target.value } : current)}>
                {products.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}
              </Select>
            </Field>
            <Field label="YouTube URL">
              <Input value={editing.youtubeUrl} onChange={(event) => setEditing((current) => current ? { ...current, youtubeUrl: event.target.value } : current)} placeholder="https://www.youtube.com/watch?v=..." />
            </Field>
            <label className="flex items-center gap-3 text-sm font-semibold text-slate">
              <input type="checkbox" checked={editing.active} onChange={(event) => setEditing((current) => current ? { ...current, active: event.target.checked } : current)} />
              Active
            </label>
          </div>
        ) : null}
      </AdminDrawer>

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.status === "active" ? "Inactive video này?" : "Active video này?"}
        description={statusTarget?.status === "active" ? "Video sẽ không còn hiển thị nút review ở trang sản phẩm." : "Video sẽ được hiển thị lại ở trang sản phẩm."}
        confirmLabel={saving ? "Đang lưu..." : statusTarget?.status === "active" ? "Chuyển inactive" : "Chuyển active"}
        onConfirm={toggleStatus}
        onClose={() => setStatusTarget(null)}
      />
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return <Badge className={active ? "border-success/25 bg-success/10 text-success" : "border-danger/25 bg-danger/10 text-danger"}>{active ? "Active" : "Inactive"}</Badge>;
}

function toProductVideo(data: Record<string, unknown>, fallback: VideoForm, title: string): ProductVideo {
  const youtubeId = String(data.youtube_id ?? "");
  return {
    id: String(data.id ?? fallback.id ?? `preview-${Date.now()}`),
    productId: String(data.product_id ?? fallback.productId),
    youtubeUrl: String(data.youtube_url ?? fallback.youtubeUrl),
    youtubeId,
    title: String(data.title ?? title),
    thumbnailUrl: String(data.thumbnail_url ?? (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "")),
    type: "Review",
    sortOrder: Number(data.sort_order ?? 0),
    featured: Boolean(data.featured),
    status: String(data.status ?? (fallback.active ? "active" : "hidden")) as ProductVideo["status"],
  };
}
