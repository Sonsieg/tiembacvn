import { NextResponse } from "next/server";
import { updatePaymentFromVnpay } from "@/lib/services/payment.service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const result = await updatePaymentFromVnpay(url.searchParams, "ipn");
    return NextResponse.json({ RspCode: result.rspCode, Message: result.message });
  } catch (error) {
    console.error("[vnpay]", { event: "ipn-get-error", error });
    return NextResponse.json({ RspCode: "99", Message: "Unknown error" });
  }
}

export async function POST(request: Request) {
  try {
    const params = await getPostParams(request);
    const result = await updatePaymentFromVnpay(params, "ipn");
    return NextResponse.json({ RspCode: result.rspCode, Message: result.message });
  } catch (error) {
    console.error("[vnpay]", { event: "ipn-post-error", error });
    return NextResponse.json({ RspCode: "99", Message: "Unknown error" });
  }
}

async function getPostParams(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    return new URLSearchParams(Object.entries(body).map(([key, value]) => [key, String(value)]));
  }

  const body = await request.formData();
  const params = new URLSearchParams();
  body.forEach((value, key) => {
    params.set(key, String(value));
  });
  return params;
}
