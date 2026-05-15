import { NextResponse } from "next/server";
import { createOrder } from "@/lib/services/order.service";
import { createVnpayPaymentUrl, hasVnpayConfig } from "@/lib/services/vnpay.service";
import { checkoutSchema } from "@/lib/validations/checkout";
import { checkCheckoutRateLimit } from "@/lib/utils/rate-limit";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = checkoutSchema.parse(json);
    const rateLimit = checkCheckoutRateLimit(getClientIp(request), input.customer.phone, input.customer.email);
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: `Bạn thao tác quá nhanh. Vui lòng thử lại sau ${Math.ceil(rateLimit.retryAfterSeconds / 60)} phút.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    if (input.paymentMethod === "online" && !hasVnpayConfig()) {
      return NextResponse.json({ error: "Thiếu cấu hình VNPay: VNPAY_TMN_CODE hoặc VNPAY_HASH_SECRET" }, { status: 400 });
    }
    const order = await createOrder(input);
    if (order.paymentMethod === "online") {
      const origin = getRequestOrigin(request);
      const paymentUrl = createVnpayPaymentUrl({ order, origin, ipAddress: getClientIp(request) });
      return NextResponse.json({ order, paymentUrl });
    }
    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo đơn hàng";
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
