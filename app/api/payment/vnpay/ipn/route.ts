import { NextResponse } from "next/server";
import { updatePaymentFromVnpay } from "@/lib/services/payment.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const result = await updatePaymentFromVnpay(url.searchParams, "ipn");
  return NextResponse.json({ RspCode: result.rspCode, Message: result.message });
}

export async function POST(request: Request) {
  const body = await request.formData();
  const params = new URLSearchParams();
  body.forEach((value, key) => {
    params.set(key, String(value));
  });
  const result = await updatePaymentFromVnpay(params, "ipn");
  return NextResponse.json({ RspCode: result.rspCode, Message: result.message });
}
