import { NextResponse } from "next/server";
import { updatePaymentFromWebhook } from "@/lib/services/payment.service";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await updatePaymentFromWebhook(body.orderNumber, body.status ?? "paid");
  return NextResponse.json(result);
}
