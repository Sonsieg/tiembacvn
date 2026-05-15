"use client";

import { CheckCircle, ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Coupon } from "@/types/commerce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { AdminDropdown } from "@/components/admin/admin-dropdown";
import { ConfirmDialog } from "@/components/admin/shared/admin-overlays";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils/format";

const couponTypeLabels: Record<string, string> = {
  percentage: "PERCENT",
  fixed_amount: "VND",
};

export function CouponAdminWorkspace({ coupons }: { coupons: Coupon[] }) {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("percentage");
  const [status, setStatus] = useState("active");
  const [statusTarget, setStatusTarget] = useState<Coupon | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, boolean>>({});
  const [statusError, setStatusError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const displayedCoupons = coupons.map((coupon) => coupon.id in statusOverrides ? { ...coupon, active: statusOverrides[coupon.id] } : coupon);
  const filtered = displayedCoupons.filter((coupon) => `${coupon.code} ${coupon.type}`.toLowerCase().includes(query.toLowerCase()));
  const perPage = Number(itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginatedCoupons = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateItemsPerPage(value: string) {
    setItemsPerPage(value);
    setPage(1);
  }

  async function confirmStatusToggle() {
    if (!statusTarget) return;
    setUpdating(true);
    setStatusError("");
    const nextActive = !statusTarget.active;

    try {
      const response = await fetch("/api/admin/entities/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "coupons", id: statusTarget.id, active: nextActive }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không thể cập nhật coupon");
      setStatusOverrides((current) => ({ ...current, [statusTarget.id]: nextActive }));
      toast({
        tone: "success",
        title: nextActive ? "Đã active coupon" : "Đã inactive coupon",
        description: `${statusTarget.code} đã được cập nhật.`,
      });
      setStatusTarget(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể cập nhật coupon";
      setStatusError(message);
      toast({ tone: "danger", title: "Cập nhật coupon thất bại", description: message });
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="grid gap-5">
      <div>
        <p className="eyebrow">Coupons</p>
        <h1 className="admin-display-title">Mã giảm giá</h1>
        <p className="mt-2 text-sm text-gray-500">Quản lý mã khuyến mãi, điều kiện tối thiểu, giới hạn sử dụng và trạng thái áp dụng ở checkout.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Mã active</p><b className="mt-2 block text-2xl text-success">{displayedCoupons.filter((coupon) => coupon.active).length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Lượt dùng tối đa</p><b className="mt-2 block text-2xl text-ink">100</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Đơn tối thiểu gợi ý</p><b className="mt-2 block text-2xl text-cta">{formatCurrency(500000)}</b></section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="admin-table-card overflow-x-auto">
          <div className="border-b border-line p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
              <Input className="!pl-12" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Tìm mã giảm giá..." />
            </div>
          </div>
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead><tr><th className="p-4">Mã</th><th>Loại</th><th>Giá trị</th><th>Đơn tối thiểu</th><th>Lượt dùng</th><th>Active</th><th>Thao tác</th></tr></thead>
            <tbody>
              {paginatedCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-t border-silver-200">
                  <td className="p-4 font-semibold text-ink">{coupon.code}</td>
                  <td>{couponTypeLabels[coupon.type] ?? "VND"}</td>
                  <td>{coupon.type === "percentage" ? `${coupon.value}%` : formatCurrency(coupon.value)}</td>
                  <td>{formatCurrency(coupon.minOrderTotal)}</td>
                  <td>{coupon.used}/{Math.min(coupon.usageLimit, 100)}</td>
                  <td><Badge className={coupon.active ? "border-success/25 bg-success/10 text-success" : "border-danger/25 bg-danger/10 text-danger"}>{coupon.active ? "Active" : "Inactive"}</Badge></td>
                  <td>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setStatusTarget(coupon)}>
                      {coupon.active ? <Trash2 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      {coupon.active ? "Inactive" : "Active"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length ? <div className="border-t border-line p-8 text-center text-sm text-slate-muted">Không có coupon phù hợp.</div> : null}
          {totalPages > 1 || filtered.length > 10 ? (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-muted">
                  Hiển thị {(safePage - 1) * perPage + 1} - {Math.min(safePage * perPage, filtered.length)} trên tổng số {filtered.length} coupon
                </span>
                <select
                  className="h-8 rounded-sm border border-silver-200 bg-white px-2 text-sm outline-none hover:border-cta focus:border-cta focus:ring-2 focus:ring-cta/20"
                  value={itemsPerPage}
                  onChange={(event) => updateItemsPerPage(event.target.value)}
                  aria-label="Số lượng coupon mỗi trang"
                >
                  <option value="10">10 / trang</option>
                  <option value="20">20 / trang</option>
                  <option value="50">50 / trang</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" size="sm" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                  <ChevronLeft className="h-4 w-4" /> Trước
                </Button>
                <span className="text-sm font-medium text-ink">{safePage} / {totalPages}</span>
                <Button type="button" variant="secondary" size="sm" disabled={safePage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                  Sau <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </section>

        <form className="admin-panel grid h-fit gap-4">
          <h2 className="text-lg font-semibold text-ink">Cấu hình coupon</h2>
          <Field label="Mã"><Input placeholder="TB-WELCOME10" /></Field>
          <Field label="Loại">
            <AdminDropdown
              ariaLabel="Chọn loại coupon"
              value={type}
              onChange={setType}
              options={[
                { value: "fixed_amount", label: "VND" },
                { value: "percentage", label: "PERCENT" },
              ]}
            />
          </Field>
          <Field label="Giá trị"><Input type="number" min={0} inputMode="numeric" placeholder="50000" /></Field>
          <Field label="Đơn tối thiểu"><Input type="number" min={0} inputMode="numeric" placeholder="500000" /></Field>
          <Field label="Lượt dùng"><Input type="number" min={1} max={100} inputMode="numeric" placeholder="100" /></Field>
          <Field label="Active">
            <AdminDropdown
              ariaLabel="Chọn trạng thái coupon"
              value={status}
              onChange={setStatus}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </Field>
          <div className="rounded-sm border border-line bg-ivory-soft p-4 text-sm text-slate-muted">
            PERCENT nên dùng cho đơn tối thiểu cao và giới hạn phần trăm thấp. VND dễ kiểm soát biên lợi nhuận hơn, đặc biệt khi đặt giá trị nhỏ hơn phần lãi gộp dự kiến của đơn tối thiểu.
          </div>
          <Button type="button" onClick={() => toast({ tone: "info", title: "Đã lưu bản nháp coupon", description: "Form coupon đang ở UI preview; thao tác active/inactive đã có API ghi database." })}>Lưu coupon</Button>
        </form>
      </div>
      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.active ? "Inactive coupon?" : "Active coupon?"}
        description={statusError || (statusTarget?.active
          ? `Coupon ${statusTarget.code} sẽ ngừng áp dụng ở checkout nhưng vẫn được giữ trong database.`
          : `Coupon ${statusTarget?.code ?? ""} sẽ được bật lại để có thể áp dụng ở checkout.`)}
        confirmLabel={updating ? "Đang lưu..." : statusTarget?.active ? "Chuyển inactive" : "Chuyển active"}
        onConfirm={confirmStatusToggle}
        onClose={() => { setStatusTarget(null); setStatusError(""); }}
      />
    </div>
  );
}
