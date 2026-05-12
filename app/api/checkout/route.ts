import { NextResponse } from "next/server";
import { createOrder } from "@/lib/services/order.service";
import { checkoutSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = checkoutSchema.parse(json);
    const order = await createOrder(input);
    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo đơn hàng";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
