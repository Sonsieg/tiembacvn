import { NextResponse } from "next/server";
import { updatePaymentFromVnpay } from "@/lib/services/payment.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const result = await updatePaymentFromVnpay(url.searchParams, "return");
  const redirectUrl = new URL("/order-success", url.origin);
  if (result.orderNumber) redirectUrl.searchParams.set("order", result.orderNumber);
  redirectUrl.searchParams.set("payment", result.status);
  return NextResponse.redirect(redirectUrl);
}
