"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/form";
import type { FulfillmentStatus, Order, OrderStatus, PaymentStatus } from "@/types/commerce";

export function OrderStatusEditor({ order, onUpdated }: { order: Order; onUpdated?: (order: Order) => void }) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentStatus>(order.fulfillmentStatus);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/admin/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus, paymentStatus, fulfillmentStatus, note }),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error ?? "Không thể cập nhật đơn hàng");
      return;
    }

    setNote("");
    setMessage("Đã cập nhật trạng thái đơn hàng.");
    onUpdated?.(data.order);
    router.refresh();
  }

  return (
    <section className="admin-panel grid gap-4">
      <div>
        <h3 className="font-semibold text-ink">Cập nhật vận hành</h3>
        <p className="mt-1 text-sm text-slate-muted">Đổi trạng thái đơn, thanh toán, giao hàng và ghi chú nội bộ vào timeline.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Trạng thái đơn">
          <Select value={orderStatus} onChange={(event) => setOrderStatus(event.target.value as OrderStatus)}>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đã gửi hàng</option>
            <option value="completed">Hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </Select>
        </Field>
        <Field label="Thanh toán">
          <Select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}>
            <option value="pending">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="failed">Thất bại</option>
            <option value="refunded">Đã hoàn tiền</option>
          </Select>
        </Field>
        <Field label="Giao hàng">
          <Select value={fulfillmentStatus} onChange={(event) => setFulfillmentStatus(event.target.value as FulfillmentStatus)}>
            <option value="unfulfilled">Chưa xử lý</option>
            <option value="packed">Đã đóng gói</option>
            <option value="shipped">Đã gửi</option>
            <option value="delivered">Đã giao</option>
            <option value="returned">Hoàn hàng</option>
          </Select>
        </Field>
      </div>
      <Field label="Ghi chú timeline">
        <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ví dụ: Khách xác nhận COD, đã đóng gói, đổi địa chỉ giao..." />
      </Field>
      {message ? <p className={message.startsWith("Đã") ? "text-sm text-success" : "text-sm text-danger"}>{message}</p> : null}
      <div className="flex justify-end">
        <Button type="button" onClick={submit} disabled={saving}><Save className="h-4 w-4" /> {saving ? "Đang lưu..." : "Lưu trạng thái"}</Button>
      </div>
    </section>
  );
}
