import crypto from "node:crypto";
import type { Order } from "@/types/commerce";

const defaultPaymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

type VnpayConfig = {
  tmnCode: string;
  hashSecret: string;
  paymentUrl: string;
};

export type VnpayVerification = {
  valid: boolean;
  orderNumber: string;
  amount: number;
  responseCode: string;
  transactionStatus: string;
  transactionNo: string;
  bankCode?: string;
  raw: Record<string, string>;
};

export function hasVnpayConfig() {
  return Boolean(process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET);
}

export function createVnpayPaymentUrl({ order, origin, ipAddress }: { order: Order; origin: string; ipAddress: string }) {
  const config = getVnpayConfig();
  const now = new Date();
  const returnUrl = process.env.VNPAY_RETURN_URL ?? `${origin}/api/payment/vnpay/return`;
  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.tmnCode,
    vnp_Amount: String(order.grandTotal * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: order.orderNumber,
    vnp_OrderInfo: `Thanh toan don hang ${order.orderNumber}`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddress,
    vnp_CreateDate: formatVnpayDate(now),
    vnp_ExpireDate: formatVnpayDate(new Date(now.getTime() + 15 * 60 * 1000)),
  };

  const secureHash = signParams(params, config.hashSecret);
  const query = buildQueryString({ ...params, vnp_SecureHash: secureHash });
  return `${config.paymentUrl}?${query}`;
}

export function verifyVnpayParams(params: URLSearchParams): VnpayVerification {
  const config = getVnpayConfig();
  const raw = Object.fromEntries(params.entries());
  const receivedHash = raw.vnp_SecureHash ?? "";
  const signedParams = { ...raw };
  delete signedParams.vnp_SecureHash;
  delete signedParams.vnp_SecureHashType;

  const expectedHash = signParams(signedParams, config.hashSecret);
  const valid = safeEqualHash(receivedHash, expectedHash);

  return {
    valid,
    orderNumber: raw.vnp_TxnRef ?? "",
    amount: Number(raw.vnp_Amount ?? 0) / 100,
    responseCode: raw.vnp_ResponseCode ?? "",
    transactionStatus: raw.vnp_TransactionStatus ?? "",
    transactionNo: raw.vnp_TransactionNo ?? "",
    bankCode: raw.vnp_BankCode,
    raw,
  };
}

function getVnpayConfig(): VnpayConfig {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  if (!tmnCode || !hashSecret) {
    throw new Error("Thiếu cấu hình VNPay: VNPAY_TMN_CODE hoặc VNPAY_HASH_SECRET");
  }
  return {
    tmnCode,
    hashSecret,
    paymentUrl: process.env.VNPAY_PAYMENT_URL ?? defaultPaymentUrl,
  };
}

function signParams(params: Record<string, string>, secret: string) {
  return crypto.createHmac("sha512", secret).update(buildQueryString(params), "utf8").digest("hex");
}

function buildQueryString(params: Record<string, string>) {
  const sorted = Object.keys(params)
    .filter((key) => params[key] !== "")
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
  return new URLSearchParams(sorted).toString();
}

function safeEqualHash(left: string, right: string) {
  if (!left || !right || left.length !== right.length) return false;
  return crypto.timingSafeEqual(Buffer.from(left, "utf8"), Buffer.from(right, "utf8"));
}

function formatVnpayDate(date: Date) {
  const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const yyyy = vnDate.getUTCFullYear();
  const MM = String(vnDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(vnDate.getUTCDate()).padStart(2, "0");
  const HH = String(vnDate.getUTCHours()).padStart(2, "0");
  const mm = String(vnDate.getUTCMinutes()).padStart(2, "0");
  const ss = String(vnDate.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}
