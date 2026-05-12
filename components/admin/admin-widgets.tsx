"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
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
  const filtered = orders.filter((order) => {
    const haystack = `${order.orderNumber} ${order.customer.fullName} ${order.customer.phone}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase()))
      && (status === "all" || order.orderStatus === status)
      && (payment === "all" || order.paymentStatus === payment);
  });
  return (
    <>
      <div className="grid gap-4">
        <div className="grid gap-3 border-b border-line p-4 lg:grid-cols-[1fr_190px_190px]">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã đơn, khách hàng, số điện thoại..." />
          <AdminDropdown ariaLabel="Lọc trạng thái đơn" value={status} onChange={setStatus} options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "pending", label: "Chờ xác nhận" },
            { value: "confirmed", label: "Đã xác nhận" },
            { value: "processing", label: "Đang xử lý" },
            { value: "shipped", label: "Đã gửi hàng" },
            { value: "completed", label: "Hoàn tất" },
            { value: "cancelled", label: "Đã hủy" },
          ]} />
          <AdminDropdown ariaLabel="Lọc thanh toán" value={payment} onChange={setPayment} options={[
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
              {filtered.map((order) => (
                <tr key={order.id} className="border-t border-line hover:bg-ivory-soft/70">
                  <td className="p-3"><button className="font-semibold text-navy hover:text-cta" onClick={() => setActiveOrder(order)}>{order.orderNumber}</button></td>
                  <td>{order.customer.fullName}<br /><span className="text-slate-muted">{order.customer.phone}</span></td>
                  <td className="font-semibold">{formatCurrency(order.grandTotal)}</td>
                  <td><StatusBadge tone={order.orderStatus}>{order.orderStatus}</StatusBadge></td>
                  <td><StatusBadge tone={order.paymentStatus}>{order.paymentStatus}</StatusBadge></td>
                  <td><AdminDropdown ariaLabel="Chuyển trạng thái đơn" value={order.orderStatus} options={[
                    { value: "pending", label: "Chờ xác nhận" },
                    { value: "confirmed", label: "Đã xác nhận" },
                    { value: "processing", label: "Đang xử lý" },
                    { value: "shipped", label: "Đã gửi hàng" },
                    { value: "completed", label: "Hoàn tất" },
                    { value: "cancelled", label: "Đã hủy" },
                  ]} /></td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <section className="admin-panel"><h3 className="font-semibold text-ink">Khách hàng</h3><p>{order.customer.fullName} · {order.customer.phone}</p><p className="text-sm text-gray-600">{order.address.addressLine}, {order.address.ward}, {order.address.district}, {order.address.province}</p></section>
      <section className="admin-panel"><h3 className="font-semibold text-ink">Sản phẩm</h3>{order.items.map((item) => <div key={item.variantId} className="flex items-center justify-between border-t border-silver-200 py-3 first:border-t-0"><span>{item.title} x {item.quantity}</span><b>{formatCurrency(item.totalPrice)}</b></div>)}<div className="flex justify-between border-t border-silver-200 pt-3"><span>Tổng cộng</span><b>{formatCurrency(order.grandTotal)}</b></div></section>
      <section className="admin-panel"><h3 className="font-semibold text-ink">Timeline</h3>{order.timeline.map((entry, index) => <p key={index} className="text-sm text-gray-600">{formatDate(entry.at)} · {entry.label} {entry.note ? `· ${entry.note}` : ""}</p>)}</section>
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
