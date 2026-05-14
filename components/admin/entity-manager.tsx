"use client";

import { CheckCircle, ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { AdminDrawer, ConfirmDialog } from "@/components/admin/shared/admin-overlays";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Textarea } from "@/components/ui/form";
import { AdminDropdown } from "@/components/admin/admin-dropdown";

type EntityRow = Record<string, string | number | boolean | undefined>;
type EntityType = "categories" | "collections";

export function EntityManager({ eyebrow, title, description, fields, rows, entity }: { eyebrow: string; title: string; description: string; fields: string[]; rows: EntityRow[]; entity: EntityType }) {
  const [mode, setMode] = useState<"create" | "edit" | "view" | null>(null);
  const [row, setRow] = useState<EntityRow | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [statusTarget, setStatusTarget] = useState<EntityRow | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, boolean>>({});
  const [statusError, setStatusError] = useState("");
  const [updating, setUpdating] = useState(false);
  const open = (nextMode: "create" | "edit" | "view", nextRow?: EntityRow) => { setMode(nextMode); setRow(nextRow ?? null); };
  const displayedRows = rows.map((item) => {
    const id = String(item.id ?? "");
    return id && id in statusOverrides ? { ...item, Active: statusOverrides[id] ? "Active" : "Inactive" } : item;
  });
  const visibleRows = displayedRows.filter((item) => fields.some((field) => String(item[field] ?? "").toLowerCase().includes(query.toLowerCase())));
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = visibleRows.slice((safePage - 1) * pageSize, safePage * pageSize);
  const activeCount = displayedRows.filter((item) => String(item.Active ?? item.Status ?? "").toLowerCase() === "active").length;

  async function confirmStatusToggle() {
    if (!statusTarget) return;
    setUpdating(true);
    setStatusError("");
    const id = String(statusTarget.id ?? "");
    const nextActive = !isActive(statusTarget);

    try {
      const response = await fetch("/api/admin/entities/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity, id, active: nextActive }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không thể cập nhật trạng thái");
      setStatusOverrides((current) => ({ ...current, [id]: nextActive }));
      setStatusTarget(null);
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Không thể cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">{eyebrow}</p><h1 className="admin-display-title">{title}</h1><p className="mt-2 text-sm text-gray-500">{description}</p></div>
        <Button type="button" onClick={() => open("create")}><Plus className="h-4 w-4" /> Thêm mới</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Tổng</p><b className="mt-2 block text-2xl text-ink">{rows.length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Active</p><b className="mt-2 block text-2xl text-success">{activeCount}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Inactive</p><b className="mt-2 block text-2xl text-danger">{Math.max(displayedRows.length - activeCount, 0)}</b></section>
      </div>
      <section className="admin-table-card overflow-x-auto">
        <div className="border-b border-line p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <Input className="!pl-12" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={`Tìm ${title.toLowerCase()}...`} />
          </div>
        </div>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead><tr>{fields.slice(0, 5).map((field) => <th key={field} className="p-4">{field}</th>)}<th>Thao tác</th></tr></thead>
          <tbody>
            {paginatedRows.map((item, index) => (
              <tr key={String(item.id ?? index)} className="border-t border-silver-200">
                {fields.slice(0, 5).map((field, fieldIndex) => <td key={field} className="p-4">{renderCell(field, item[field], fieldIndex === 0 ? `${title} ${index + 1}` : "Đang cấu hình")}</td>)}
                <td>
                  <div className="flex gap-1">
                    <button type="button" className="admin-icon-button" onClick={() => open("view", item)} aria-label="Xem" title="Xem nhanh"><Eye className="h-4 w-4" /></button>
                    <button type="button" className="admin-icon-button" onClick={() => open("edit", item)} aria-label="Sửa" title="Sửa"><Pencil className="h-4 w-4" /></button>
                    <button type="button" className="admin-icon-button" onClick={() => setStatusTarget(item)} aria-label={isActive(item) ? "Inactive" : "Active"} title={isActive(item) ? "Chuyển inactive" : "Chuyển active"}>
                      {isActive(item) ? <Trash2 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visibleRows.length ? <div className="border-t border-line p-8 text-center text-sm text-slate-muted">Không có dữ liệu phù hợp.</div> : null}
        {visibleRows.length > pageSize ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4">
            <span className="text-sm text-slate-muted">Hiển thị {(safePage - 1) * pageSize + 1} - {Math.min(safePage * pageSize, visibleRows.length)} / {visibleRows.length}</span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft className="h-4 w-4" /> Trước</Button>
              <span className="text-sm font-medium text-ink">{safePage} / {totalPages}</span>
              <Button type="button" variant="secondary" size="sm" disabled={safePage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Sau <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        ) : null}
      </section>
      <AdminDrawer
        open={Boolean(mode)}
        title={mode === "create" ? `Thêm ${title.toLowerCase()}` : mode === "edit" ? `Sửa ${title.toLowerCase()}` : `Xem ${title.toLowerCase()}`}
        description="Thao tác nhanh bằng drawer để giữ ngữ cảnh danh sách."
        onClose={() => setMode(null)}
        width="max-w-2xl"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setMode(null)}>Hủy</Button>{mode !== "view" ? <Button>Lưu thay đổi</Button> : null}</div>}
      >
        <div className="admin-panel grid gap-4">
          {fields.slice(0, 6).map((field) => {
            const lower = field.toLowerCase();
            if (lower.includes("description") || lower.includes("mô tả")) return <Field key={field} label={field}><Textarea defaultValue={String(row?.[field] ?? "")} readOnly={mode === "view"} /></Field>;
            if (lower.includes("active") || lower.includes("status")) {
              const value = String(row?.[field] ?? "Active").toLowerCase() === "active" ? "active" : "inactive";
              return (
                <Field key={field} label={field}>
                  <AdminDropdown
                    ariaLabel={`Chọn ${field}`}
                    value={value}
                    onChange={() => undefined}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]}
                    className={mode === "view" ? "pointer-events-none opacity-70" : ""}
                  />
                </Field>
              );
            }
            return <Field key={field} label={field}><Input defaultValue={String(row?.[field] ?? "")} readOnly={mode === "view"} /></Field>;
          })}
        </div>
      </AdminDrawer>
      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget && isActive(statusTarget) ? "Inactive mục này?" : "Active mục này?"}
        description={statusError || (statusTarget && isActive(statusTarget)
          ? "Mục này sẽ được chuyển sang inactive và không hiển thị ở storefront. Dữ liệu vẫn được giữ trong database."
          : "Mục này sẽ được bật lại active và có thể hiển thị ở storefront.")}
        confirmLabel={updating ? "Đang lưu..." : statusTarget && isActive(statusTarget) ? "Chuyển inactive" : "Chuyển active"}
        onConfirm={confirmStatusToggle}
        onClose={() => { setStatusTarget(null); setStatusError(""); }}
      />
    </div>
  );
}

function isActive(item: EntityRow) {
  return String(item.Active ?? item.Status ?? "").toLowerCase() === "active";
}

function renderCell(field: string, value: EntityRow[string], fallback: string) {
  const label = String(value ?? fallback);
  const lower = field.toLowerCase();
  const normalized = label.toLowerCase();

  if (lower.includes("image") || lower.includes("ảnh")) {
    return label && label !== fallback ? <img src={label} alt="" className="h-12 w-12 rounded-sm object-cover" /> : <span className="text-slate-muted">Chưa có ảnh</span>;
  }

  if (lower.includes("active") || lower.includes("status") || normalized === "active" || normalized === "inactive") {
    const className = normalized === "active"
      ? "border-success/25 bg-success/10 text-success"
      : "border-danger/25 bg-danger/10 text-danger";
    return <Badge className={className}>{label}</Badge>;
  }

  if (label.startsWith("http")) return <span className="block max-w-xs truncate text-slate-muted">{label}</span>;
  return <span className="block max-w-sm truncate">{label}</span>;
}
