import { NextResponse } from "next/server";
import { trackOrder } from "@/lib/services/order.service";
import { trackOrderSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  try {
    const input = trackOrderSchema.parse(await request.json());
    const order = await trackOrder(input.orderNumber, input.emailOrPhone);
    if (!order) return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tra cứu đơn hàng";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
