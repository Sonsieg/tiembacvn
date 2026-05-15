import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/services/order.service";
import { createVnpayPaymentUrl, hasVnpayConfig } from "@/lib/services/vnpay.service";

export async function POST(request: Request) {
  try {
    if (!hasVnpayConfig()) {
      return NextResponse.json({ error: "Thiếu cấu hình VNPay: VNPAY_TMN_CODE hoặc VNPAY_HASH_SECRET" }, { status: 400 });
    }

    const body = await request.json();
    const orderNumber = String(body.orderNumber ?? "").trim().toUpperCase();
    if (!orderNumber) return NextResponse.json({ error: "Thiếu mã đơn hàng" }, { status: 400 });

    const order = await getOrderById(orderNumber);
    if (!order) return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    if (order.paymentMethod !== "online") return NextResponse.json({ error: "Đơn hàng không dùng VNPay" }, { status: 400 });
    if (order.paymentStatus === "paid") return NextResponse.json({ error: "Đơn hàng đã thanh toán" }, { status: 409 });
    if (order.paymentStatus !== "pending") return NextResponse.json({ error: "Đơn hàng không còn ở trạng thái chờ thanh toán" }, { status: 409 });

    const paymentUrl = createVnpayPaymentUrl({
      order,
      origin: getRequestOrigin(request),
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ orderNumber: order.orderNumber, paymentUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo liên kết thanh toán VNPay";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function getRequestOrigin(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedProto && forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return new URL(request.url).origin;
}

function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "127.0.0.1";
}
