"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import type { FulfillmentStatus, Order, OrderStatus, PaymentStatus } from "@/types/commerce";
import { fulfillmentStatusLabels, getOrderWorkflowActions, orderStatusLabels, paymentMethodLabels, paymentStatusLabels, type OrderWorkflowAction } from "@/lib/utils/order-workflow";

export function OrderStatusEditor({ order, onUpdated }: { order: Order; onUpdated?: (order: Order) => void }) {
  const router = useRouter();
  const toast = useToast();
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentStatus>(order.fulfillmentStatus);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const workflowActions = getOrderWorkflowActions(order);

  async function save(payload: { action?: OrderWorkflowAction; orderStatus?: OrderStatus; paymentStatus?: PaymentStatus; fulfillmentStatus?: FulfillmentStatus; note?: string }) {
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/admin/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      const errorMessage = data.error ?? "Không thể cập nhật đơn hàng";
      setMessage(errorMessage);
      toast({ tone: "danger", title: "Cập nhật đơn thất bại", description: errorMessage });
      return;
    }

    setNote("");
    if (data.order) {
      setOrderStatus(data.order.orderStatus);
      setPaymentStatus(data.order.paymentStatus);
      setFulfillmentStatus(data.order.fulfillmentStatus);
    }
    setMessage("Đã cập nhật trạng thái đơn hàng.");
    toast({ tone: "success", title: "Đã cập nhật trạng thái", description: `${order.orderNumber} đã được ghi vào timeline.` });
    onUpdated?.(data.order);
    router.refresh();
  }

  async function submit() {
    await save({ orderStatus, paymentStatus, fulfillmentStatus, note });
  }

  async function runAction(action: OrderWorkflowAction) {
    await save({ action, note });
  }

  return (
    <section className="admin-panel grid gap-4">
      <div>
        <h3 className="font-semibold text-ink">Cập nhật vận hành</h3>
        <p className="mt-1 text-sm text-slate-muted">{paymentMethodLabels[order.paymentMethod]} · {orderStatusLabels[order.orderStatus]} · {paymentStatusLabels[order.paymentStatus]} · {fulfillmentStatusLabels[order.fulfillmentStatus]}</p>
      </div>
      {workflowActions.length ? (
        <div className="flex flex-wrap gap-2">
          {workflowActions.map((action) => (
            <Button key={action.value} type="button" variant={action.value === "cancel" ? "secondary" : "primary"} size="sm" onClick={() => runAction(action.value)} disabled={saving}>
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Trạng thái đơn">
          <Select value={orderStatus} onChange={(event) => setOrderStatus(event.target.value as OrderStatus)}>
            {Object.entries(orderStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
        <Field label="Thanh toán">
          <Select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}>
            {Object.entries(paymentStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
        <Field label="Giao hàng">
          <Select value={fulfillmentStatus} onChange={(event) => setFulfillmentStatus(event.target.value as FulfillmentStatus)}>
            {Object.entries(fulfillmentStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
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
