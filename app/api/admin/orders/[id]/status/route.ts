import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateOrderStatus } from "@/lib/services/order.service";
import type { OrderStatusUpdateInput } from "@/types/commerce";

const orderStatuses = new Set(["pending", "confirmed", "processing", "shipped", "completed", "cancelled"]);
const paymentStatuses = new Set(["pending", "paid", "failed", "refunded"]);
const fulfillmentStatuses = new Set(["unfulfilled", "packed", "shipped", "delivered", "returned"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("tiembac_admin_session")?.value !== "authenticated") {
      return NextResponse.json({ error: "Bạn cần đăng nhập admin" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const input: OrderStatusUpdateInput = {};

    if (body.orderStatus) {
      if (!orderStatuses.has(body.orderStatus)) return NextResponse.json({ error: "Trạng thái đơn không hợp lệ" }, { status: 400 });
      input.orderStatus = body.orderStatus;
    }

    if (body.paymentStatus) {
      if (!paymentStatuses.has(body.paymentStatus)) return NextResponse.json({ error: "Trạng thái thanh toán không hợp lệ" }, { status: 400 });
      input.paymentStatus = body.paymentStatus;
    }

    if (body.fulfillmentStatus) {
      if (!fulfillmentStatuses.has(body.fulfillmentStatus)) return NextResponse.json({ error: "Trạng thái giao hàng không hợp lệ" }, { status: 400 });
      input.fulfillmentStatus = body.fulfillmentStatus;
    }

    if (body.note) input.note = String(body.note);

    const order = await updateOrderStatus(id, input);
    if (!order) return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật đơn hàng";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
