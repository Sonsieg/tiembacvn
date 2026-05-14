"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { AdminDropdown } from "@/components/admin/admin-dropdown";
import { AdminDrawer } from "@/components/admin/shared/admin-overlays";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Order, Product } from "@/types/commerce";

export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <Card className="p-5"><p className="text-sm text-gray-500">{label}</p><b className="mt-2 block text-2xl text-ink">{value}</b><span className="text-xs text-claret">{hint}</span></Card>;
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  function resetPage() {
    setPage(1);
  }

  function updateStatus(nextStatus: string) {
    setStatus(nextStatus);
    resetPage();
  }

  function updatePayment(nextPayment: string) {
    setPayment(nextPayment);
    resetPage();
  }

  function updateItemsPerPage(nextItemsPerPage: string) {
    setItemsPerPage(nextItemsPerPage);
    resetPage();
  }

  const filtered = orders.filter((order) => {
    const haystack = `${order.orderNumber} ${order.customer.fullName} ${order.customer.phone}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase()))
      && (status === "all" || order.orderStatus === status)
      && (payment === "all" || order.paymentStatus === payment);
  });

  const perPage = Number(itemsPerPage);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedOrders = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <div className="grid gap-4">
        <div className="grid gap-3 border-b border-line p-4 lg:grid-cols-[1fr_190px_190px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <Input className="!pl-12" value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder="Tìm mã đơn, khách hàng, số điện thoại..." />
          </div>
          <AdminDropdown ariaLabel="Lọc trạng thái đơn" value={status} onChange={updateStatus} options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "pending", label: "Chờ xác nhận" },
            { value: "confirmed", label: "Đã xác nhận" },
            { value: "processing", label: "Đang xử lý" },
            { value: "shipped", label: "Đã gửi hàng" },
            { value: "completed", label: "Hoàn tất" },
            { value: "cancelled", label: "Đã hủy" },
          ]} />
          <AdminDropdown ariaLabel="Lọc thanh toán" value={payment} onChange={updatePayment} options={[
            { value: "all", label: "Tất cả thanh toán" },
            { value: "pending", label: "Chờ thanh toán" },
            { value: "paid", label: "Đã thanh toán" },
            { value: "failed", label: "Thất bại" },
            { value: "refunded", label: "Đã hoàn tiền" },
          ]} />
        </div>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-slate-muted"><tr><th className="p-3">Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thanh toán</th><th>Cập nhật nhanh</th><th>Ngày tạo</th></tr></thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-t border-line hover:bg-ivory-soft/70">
                  <td className="p-3"><button className="font-semibold text-navy hover:text-cta" onClick={() => setActiveOrder(order)}>{order.orderNumber}</button></td>
                  <td>{order.customer.fullName}<br /><span className="text-slate-muted">{order.customer.phone}</span></td>
                  <td className="font-semibold">{formatCurrency(order.grandTotal)}</td>
                  <td><StatusBadge tone={order.orderStatus}>{order.orderStatus}</StatusBadge></td>
                  <td><StatusBadge tone={order.paymentStatus}>{order.paymentStatus}</StatusBadge></td>
                  <td>
                    <Select className="min-w-[170px]" aria-label="Chuyển trạng thái đơn" defaultValue={order.orderStatus}>
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipped">Đã gửi hàng</option>
                      <option value="completed">Hoàn tất</option>
                      <option value="cancelled">Đã hủy</option>
                    </Select>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!paginatedOrders.length ? <div className="border-t border-line p-8 text-center text-sm text-slate-muted">Không có đơn hàng phù hợp.</div> : null}
        </div>
        {totalPages > 1 || filtered.length > 10 ? (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Hiển thị {(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} trên tổng số {filtered.length} đơn hàng
              </span>
              <select
                className="h-8 rounded-sm border border-silver-200 bg-white px-2 text-sm outline-none hover:border-cta focus:border-cta focus:ring-2 focus:ring-cta/20"
                value={itemsPerPage}
                onChange={(event) => updateItemsPerPage(event.target.value)}
                aria-label="Số lượng mỗi trang"
              >
                <option value="10">10 / trang</option>
                <option value="20">20 / trang</option>
                <option value="50">50 / trang</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" /> Trước
              </Button>
              <span className="text-sm font-medium text-ink">
                {page} / {totalPages}
              </span>
              <Button type="button" variant="secondary" size="sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Sau <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      <AdminDrawer open={Boolean(activeOrder)} title="Chi tiết đơn hàng" description="Xem nhanh và cập nhật đơn mà không rời khỏi danh sách." onClose={() => setActiveOrder(null)} width="max-w-2xl" footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setActiveOrder(null)}>Đóng</Button><Button>Ghi chú / cập nhật</Button></div>}>
        {activeOrder ? <OrderDetail order={activeOrder} /> : null}
      </AdminDrawer>
    </>
  );
}

function StatusBadge({ children, tone }: { children: ReactNode; tone: string }) {
  const className = tone === "cancelled" || tone === "failed"
    ? "border-danger/25 bg-danger/10 text-danger"
    : tone === "pending"
      ? "border-warning/25 bg-warning/10 text-warning"
      : tone === "paid" || tone === "completed"
        ? "border-success/25 bg-success/10 text-success"
        : "border-cta/25 bg-cta-soft text-navy";
  return <Badge className={className}>{children}</Badge>;
}

function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="grid gap-5">
      <section className="admin-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="font-semibold text-ink">{order.orderNumber}</h3><p className="text-sm text-slate-muted">{formatDate(order.createdAt)}</p></div>
          <div className="flex flex-wrap gap-2"><StatusBadge tone={order.orderStatus}>{order.orderStatus}</StatusBadge><StatusBadge tone={order.paymentStatus}>{order.paymentStatus}</StatusBadge></div>
        </div>
      </section>
      <section className="admin-panel"><h3 className="font-semibold text-ink">Khách hàng</h3><p className="mt-2 font-medium">{order.customer.fullName} · {order.customer.phone}</p><p className="mt-1 text-sm text-gray-600">{order.address.addressLine}, {order.address.ward}, {order.address.district}, {order.address.province}</p>{order.address.note ? <p className="mt-1 text-sm text-warning">{order.address.note}</p> : null}</section>
      <section className="admin-panel">
        <h3 className="font-semibold text-ink">Sản phẩm</h3>
        <div className="mt-3 grid gap-3">
          {order.items.map((item) => (
            <div key={item.variantId} className="flex items-center justify-between gap-3 border-t border-silver-200 pt-3 first:border-t-0 first:pt-0">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.title} className="h-12 w-12 rounded-sm object-cover" />
                <span><b className="block text-ink">{item.title}</b><span className="text-xs text-slate-muted">{item.variantTitle} · {item.sku} · x{item.quantity}</span></span>
              </div>
              <b className="shrink-0">{formatCurrency(item.totalPrice)}</b>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2 border-t border-silver-200 pt-4 text-sm">
          <div className="flex justify-between"><span>Tạm tính</span><b>{formatCurrency(order.subtotal)}</b></div>
          <div className="flex justify-between"><span>Giảm giá</span><b>{formatCurrency(order.discountTotal)}</b></div>
          <div className="flex justify-between"><span>Phí vận chuyển</span><b>{formatCurrency(order.shippingFee)}</b></div>
          <div className="flex justify-between text-base"><span>Tổng cộng</span><b className="text-cta">{formatCurrency(order.grandTotal)}</b></div>
        </div>
      </section>
      <section className="admin-panel"><h3 className="font-semibold text-ink">Timeline</h3><div className="mt-3 grid gap-2">{order.timeline.map((entry, index) => <p key={index} className="rounded-sm border border-line bg-pearl p-3 text-sm text-gray-600">{formatDate(entry.at)} · {entry.label} {entry.note ? `· ${entry.note}` : ""}</p>)}</div></section>
    </div>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <Card className="overflow-x-auto p-4">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="text-gray-500"><tr><th className="p-3">Sản phẩm</th><th>SKU</th><th>Giá</th><th>Tồn khả dụng</th><th>Trạng thái</th><th>SEO</th></tr></thead>
        <tbody>
          {products.map((product) => {
            const variant = product.variants[0];
            return <tr key={product.id} className="border-t border-silver-200"><td className="flex items-center gap-3 p-3"><img src={product.images[0]} alt={product.title} className="h-12 w-12 rounded-xl object-cover" /><Link className="font-medium text-claret" href={`/admin/products/${product.id}`}>{product.title}</Link></td><td>{variant.sku}</td><td>{formatCurrency(variant.price)}</td><td>{variant.inventory.quantityAvailable - variant.inventory.quantityReserved}</td><td><Badge>{product.status}</Badge></td><td className="max-w-xs truncate">{product.seoTitle}</td></tr>;
          })}
        </tbody>
      </table>
    </Card>
  );
}
