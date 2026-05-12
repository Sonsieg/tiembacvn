import { NextResponse } from "next/server";
import { getOrders } from "@/lib/services/order.service";

export async function GET() {
  return NextResponse.json({ orders: await getOrders() });
}
