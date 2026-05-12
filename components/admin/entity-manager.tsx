"use client";

import { Eye, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AdminDrawer } from "@/components/admin/shared/admin-overlays";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";

type EntityRow = Record<string, string | number | boolean | undefined>;

export function EntityManager({ eyebrow, title, description, fields, rows }: { eyebrow: string; title: string; description: string; fields: string[]; rows: EntityRow[] }) {
  const [mode, setMode] = useState<"create" | "edit" | "view" | null>(null);
  const [row, setRow] = useState<EntityRow | null>(null);
  const open = (nextMode: "create" | "edit" | "view", nextRow?: EntityRow) => { setMode(nextMode); setRow(nextRow ?? null); };
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">{eyebrow}</p><h1 className="admin-display-title">{title}</h1><p className="mt-2 text-sm text-gray-500">{description}</p></div>
        <Button type="button" onClick={() => open("create")}><Plus className="h-4 w-4" /> Thêm mới</Button>
      </div>
      <section className="admin-table-card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead><tr>{fields.slice(0, 5).map((field) => <th key={field} className="p-4">{field}</th>)}<th>Thao tác</th></tr></thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={index} className="border-t border-silver-200">
                {fields.slice(0, 5).map((field, fieldIndex) => <td key={field} className="p-4">{String(item[field] ?? (fieldIndex === 0 ? `${title} ${index + 1}` : "Đang cấu hình"))}</td>)}
                <td><div className="flex gap-1"><button className="admin-icon-button" onClick={() => open("view", item)} aria-label="Xem"><Eye className="h-4 w-4" /></button><button className="admin-icon-button" onClick={() => open("edit", item)} aria-label="Sửa"><Pencil className="h-4 w-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <AdminDrawer
        open={Boolean(mode)}
        title={mode === "create" ? `Thêm ${title.toLowerCase()}` : mode === "edit" ? `Sửa ${title.toLowerCase()}` : `Xem ${title.toLowerCase()}`}
        description="Thao tác nhanh bằng drawer để giữ ngữ cảnh danh sách."
        onClose={() => setMode(null)}
        width="max-w-2xl"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setMode(null)}>Hủy</Button>{mode !== "view" ? <Button>Lưu thay đổi</Button> : null}</div>}
      >
        <div className="admin-panel">
          {fields.slice(0, 6).map((field) => {
            const lower = field.toLowerCase();
            if (lower.includes("description") || lower.includes("mô tả")) return <Field key={field} label={field}><Textarea defaultValue={String(row?.[field] ?? "")} readOnly={mode === "view"} /></Field>;
            if (lower.includes("active") || lower.includes("status") || lower.includes("featured")) return <Field key={field} label={field}><Select defaultValue={String(row?.[field] ?? "active")} disabled={mode === "view"}><option value="active">Active</option><option value="hidden">Hidden</option><option value="archived">Archived</option></Select></Field>;
            return <Field key={field} label={field}><Input defaultValue={String(row?.[field] ?? "")} readOnly={mode === "view"} /></Field>;
          })}
        </div>
      </AdminDrawer>
    </div>
  );
}
