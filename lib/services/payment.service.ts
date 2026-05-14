import { updateOrderStatus } from "@/lib/services/order.service";

export async function updatePaymentFromWebhook(orderNumber: string, status: "paid" | "failed" | "refunded") {
  // Production path: verify provider signature first, then update payments/orders.
  await updateOrderStatus(orderNumber, { paymentStatus: status, note: `Webhook thanh toán: ${status}` });
  return {
    ok: true,
    orderNumber,
    status,
    message: "Webhook thanh toán đã được ghi nhận",
  };
}
