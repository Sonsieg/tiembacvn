export async function updatePaymentFromWebhook(orderNumber: string, status: "paid" | "failed" | "refunded") {
  // Production path: verify provider signature first, then update payments/orders.
  return {
    ok: true,
    orderNumber,
    status,
    message: "Webhook thanh toán đã được ghi nhận",
  };
}
