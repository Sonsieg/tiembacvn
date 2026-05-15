import { NextResponse } from "next/server";
import { updatePaymentFromVnpay } from "@/lib/services/payment.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUrl = new URL("/order-success", url.origin);
  try {
    const result = await updatePaymentFromVnpay(url.searchParams, "return");
    if (result.orderNumber) redirectUrl.searchParams.set("order", result.orderNumber);
    redirectUrl.searchParams.set("payment", result.status);
  } catch (error) {
    console.error("[vnpay]", { event: "return-error", error });
    redirectUrl.searchParams.set("payment", "failed");
  }
  return NextResponse.redirect(redirectUrl);
}
