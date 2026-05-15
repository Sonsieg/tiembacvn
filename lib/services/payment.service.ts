import { updateOrderStatus } from "@/lib/services/order.service";
import { getOrderById } from "@/lib/services/order.service";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { amountsMatch, isSuccessfulVnpayTransaction, verifyVnpayParams, type VnpayVerification } from "@/lib/services/vnpay.service";

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

export async function updatePaymentFromVnpay(params: URLSearchParams, source: "return" | "ipn") {
  const verification = verifyVnpayParams(params);
  logVnpayEvent("received", source, verification);

  if (!verification.valid) {
    logVnpayEvent("invalid-checksum", source, verification);
    return { ok: false, orderNumber: verification.orderNumber, status: "failed" as const, rspCode: "97", message: "Sai checksum" };
  }

  const order = await getOrderById(verification.orderNumber);
  if (!order) {
    logVnpayEvent("missing-order", source, verification);
    return { ok: false, orderNumber: verification.orderNumber, status: "failed" as const, rspCode: "01", message: "Không tìm thấy đơn hàng" };
  }

  if (!amountsMatch(order.grandTotal, verification.amount)) {
    logVnpayEvent("invalid-amount", source, verification);
    return { ok: false, orderNumber: order.orderNumber, status: "failed" as const, rspCode: "04", message: "Số tiền không hợp lệ" };
  }

  const paid = isSuccessfulVnpayTransaction(verification);
  const paymentStatus = paid ? "paid" : "failed";

  if (order.paymentStatus === "paid") {
    await persistVnpayPayment(order.id, verification, "paid");
    return {
      ok: true,
      orderNumber: order.orderNumber,
      status: "paid" as const,
      rspCode: source === "ipn" ? "02" : "00",
      message: source === "ipn" ? "Order already confirmed" : "Confirm Success",
    };
  }

  if (order.paymentStatus !== paymentStatus) {
    await updateOrderStatus(order.orderNumber, {
      paymentStatus,
      orderStatus: paid ? "confirmed" : order.orderStatus,
      note: `VNPay ${source}: ${paymentStatus} (${verification.responseCode}/${verification.transactionStatus})`,
    });
  }

  await persistVnpayPayment(order.id, verification, paymentStatus);

  return {
    ok: paid,
    orderNumber: order.orderNumber,
    status: paymentStatus,
    rspCode: "00",
    message: paid ? "Confirm Success" : "Giao dịch không thành công",
  };
}

async function persistVnpayPayment(orderId: string, verification: VnpayVerification, status: "paid" | "failed") {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !isUuid(orderId)) return;

  const patch = {
    provider: "vnpay",
    amount: verification.amount,
    status,
    transaction_id: verification.transactionNo || null,
    raw_payload: verification.raw,
  };

  const { data } = await supabase.from("payments").select("id").eq("order_id", orderId).limit(1).maybeSingle();
  if (data?.id) {
    await supabase.from("payments").update(patch).eq("id", data.id);
    return;
  }

  await supabase.from("payments").insert({ order_id: orderId, ...patch });
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function logVnpayEvent(event: string, source: "return" | "ipn", verification: Pick<VnpayVerification, "orderNumber" | "amount" | "responseCode" | "transactionStatus" | "transactionNo">) {
  console.info("[vnpay]", {
    event,
    source,
    orderNumber: verification.orderNumber,
    amount: verification.amount,
    responseCode: verification.responseCode,
    transactionStatus: verification.transactionStatus,
    transactionNo: verification.transactionNo,
  });
}
