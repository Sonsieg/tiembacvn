import type { FulfillmentStatus, Order, OrderStatus, OrderStatusUpdateInput, PaymentMethod, PaymentStatus } from "@/types/commerce";

export type OrderWorkflowAction = "confirm" | "mark_paid" | "pack" | "ship" | "complete" | "cancel";

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán lỗi",
  refunded: "Đã hoàn tiền",
};

export const fulfillmentStatusLabels: Record<FulfillmentStatus, string> = {
  unfulfilled: "Chưa xử lý",
  packed: "Đã đóng gói",
  shipped: "Đang giao",
  delivered: "Đã giao",
  returned: "Hoàn hàng",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cod: "COD",
  bank_transfer: "Chuyển khoản",
  online: "VNPay",
};

export function getOrderWorkflowActions(order: Order) {
  if (order.orderStatus === "completed") return [];
  if (order.orderStatus === "cancelled") return [];

  const actions: { value: OrderWorkflowAction; label: string }[] = [];

  if (order.paymentMethod === "cod") {
    if (order.orderStatus === "pending") actions.push({ value: "confirm", label: "Xác nhận COD" });
    if (order.orderStatus === "confirmed") actions.push({ value: "pack", label: "Đóng gói" });
    if (order.orderStatus === "processing") actions.push({ value: "ship", label: "Bàn giao vận chuyển" });
    if (order.orderStatus === "shipped") actions.push({ value: "complete", label: "Hoàn tất COD" });
    actions.push({ value: "cancel", label: "Hủy đơn" });
    return actions;
  }

  if (order.paymentStatus !== "paid") {
    actions.push({ value: "mark_paid", label: order.paymentMethod === "online" ? "Đối soát đã thanh toán" : "Đánh dấu đã thanh toán" });
    actions.push({ value: "cancel", label: "Hủy đơn" });
    return actions;
  }

  if (order.orderStatus === "pending") actions.push({ value: "confirm", label: "Xác nhận đơn" });
  if (order.orderStatus === "confirmed") actions.push({ value: "pack", label: "Đóng gói" });
  if (order.orderStatus === "processing") actions.push({ value: "ship", label: "Bàn giao vận chuyển" });
  if (order.orderStatus === "shipped") actions.push({ value: "complete", label: "Hoàn tất đơn" });
  actions.push({ value: "cancel", label: order.paymentStatus === "paid" ? "Hoàn tiền & hủy" : "Hủy đơn" });
  return actions;
}

export function applyOrderWorkflowAction(order: Order, action: OrderWorkflowAction): OrderStatusUpdateInput {
  if (action === "confirm") {
    return { orderStatus: "confirmed", fulfillmentStatus: "unfulfilled", note: "Admin xác nhận đơn hàng" };
  }
  if (action === "mark_paid") {
    return { orderStatus: "confirmed", paymentStatus: "paid", fulfillmentStatus: "unfulfilled", note: "Admin ghi nhận thanh toán" };
  }
  if (action === "pack") {
    return { orderStatus: "processing", fulfillmentStatus: "packed", note: "Đơn hàng đã được đóng gói" };
  }
  if (action === "ship") {
    return { orderStatus: "shipped", fulfillmentStatus: "shipped", note: "Đơn hàng đã bàn giao vận chuyển" };
  }
  if (action === "complete") {
    return { orderStatus: "completed", paymentStatus: "paid", fulfillmentStatus: "delivered", note: order.paymentMethod === "cod" ? "Khách đã nhận hàng và thanh toán COD" : "Đơn hàng đã hoàn tất" };
  }
  return {
    orderStatus: "cancelled",
    paymentStatus: order.paymentStatus === "paid" ? "refunded" : "failed",
    fulfillmentStatus: order.fulfillmentStatus === "shipped" || order.fulfillmentStatus === "delivered" ? "returned" : "unfulfilled",
    note: order.paymentStatus === "paid" ? "Đơn đã hủy và ghi nhận hoàn tiền" : "Đơn đã hủy",
  };
}

export function normalizeOrderStatusInput(order: Order, input: OrderStatusUpdateInput): OrderStatusUpdateInput {
  const next: OrderStatusUpdateInput = { ...input };

  if (next.orderStatus === "confirmed" && !next.fulfillmentStatus) next.fulfillmentStatus = "unfulfilled";
  if (next.orderStatus === "processing") next.fulfillmentStatus = "packed";
  if (next.orderStatus === "shipped") next.fulfillmentStatus = "shipped";
  if (next.orderStatus === "completed") {
    next.paymentStatus = "paid";
    next.fulfillmentStatus = "delivered";
  }
  if (next.orderStatus === "cancelled") {
    const paymentStatus = next.paymentStatus ?? order.paymentStatus;
    next.paymentStatus = paymentStatus === "paid" ? "refunded" : "failed";
    next.fulfillmentStatus = order.fulfillmentStatus === "shipped" || order.fulfillmentStatus === "delivered" ? "returned" : "unfulfilled";
  }

  return next;
}
