import crypto from "node:crypto";
import type { Order } from "@/types/commerce";

const defaultPaymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnpayVersion = "2.1.0";
const vnpayCommand = "pay";
const defaultLocale = "vn";
const defaultCurrency = "VND";
const defaultOrderType = "other";
const paymentTimeoutMinutes = 15;

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

export type VnpayCreatePaymentInput = {
  order: Order;
  origin: string;
  ipAddress: string;
};

export function hasVnpayConfig() {
  return Boolean(process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET);
}

export function createVnpayPaymentUrl({ order, origin, ipAddress }: VnpayCreatePaymentInput) {
  const config = getVnpayConfig();
  const now = new Date();
  const returnUrl = resolveReturnUrl(origin);
  const amount = normalizeVnpayAmount(order.grandTotal);
  const params: Record<string, string> = {
    vnp_Version: vnpayVersion,
    vnp_Command: vnpayCommand,
    vnp_TmnCode: config.tmnCode,
    vnp_Amount: String(amount),
    vnp_CurrCode: defaultCurrency,
    vnp_TxnRef: order.orderNumber,
    vnp_OrderInfo: `Thanh toan don hang ${order.orderNumber}`,
    vnp_OrderType: defaultOrderType,
    vnp_Locale: defaultLocale,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: normalizeIpAddress(ipAddress),
    vnp_CreateDate: formatVnpayDate(now),
    vnp_ExpireDate: formatVnpayDate(new Date(now.getTime() + paymentTimeoutMinutes * 60 * 1000)),
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

export function isSuccessfulVnpayTransaction(verification: Pick<VnpayVerification, "responseCode" | "transactionStatus">) {
  return verification.responseCode === "00" && verification.transactionStatus === "00";
}

export function normalizeVnpayAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Số tiền VNPay không hợp lệ");
  return Math.round(amount) * 100;
}

export function amountsMatch(orderAmount: number, vnpayAmount: number) {
  return normalizeVnpayAmount(orderAmount) === normalizeVnpayAmount(vnpayAmount);
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
  return Object.keys(params)
    .filter((key) => params[key] !== "")
    .sort()
    .map((key) => `${vnpayEncode(key)}=${vnpayEncode(params[key])}`)
    .join("&");
}

function vnpayEncode(value: string) {
  // VNPay 2.1.0 hashes the sorted query string with URL-encoded keys and values.
  // Their samples use application/x-www-form-urlencoded semantics, where spaces are "+".
  return encodeURIComponent(value).replace(/%20/g, "+");
}

function safeEqualHash(left: string, right: string) {
  if (!left || !right || left.length !== right.length) return false;
  return crypto.timingSafeEqual(Buffer.from(left, "utf8"), Buffer.from(right, "utf8"));
}

function formatVnpayDate(date: Date) {
  // VNPay expects yyyyMMddHHmmss in Vietnam time (UTC+7), not server local time.
  const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const yyyy = vnDate.getUTCFullYear();
  const MM = String(vnDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(vnDate.getUTCDate()).padStart(2, "0");
  const HH = String(vnDate.getUTCHours()).padStart(2, "0");
  const mm = String(vnDate.getUTCMinutes()).padStart(2, "0");
  const ss = String(vnDate.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

function resolveReturnUrl(origin: string) {
  const configuredReturnUrl = process.env.VNPAY_RETURN_URL?.trim();
  if (configuredReturnUrl) {
    const localOriginReturnUrl = resolveLocalDevReturnUrl(configuredReturnUrl, origin);
    return localOriginReturnUrl ?? configuredReturnUrl;
  }

  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const baseUrl = publicSiteUrl || origin;
  return `${baseUrl.replace(/\/$/, "")}/api/payment/vnpay/return`;
}

function resolveLocalDevReturnUrl(configuredReturnUrl: string, origin: string) {
  try {
    const configured = new URL(configuredReturnUrl);
    const requestOrigin = new URL(origin);
    const configuredLocal = configured.hostname === "localhost" || configured.hostname === "127.0.0.1";
    const requestLocal = requestOrigin.hostname === "localhost" || requestOrigin.hostname === "127.0.0.1";
    if (!configuredLocal || !requestLocal || configured.origin === requestOrigin.origin) return null;

    console.warn("[vnpay]", {
      event: "local-return-url-port-mismatch",
      configuredReturnUrl,
      requestOrigin: requestOrigin.origin,
    });
    return `${requestOrigin.origin}/api/payment/vnpay/return`;
  } catch {
    return null;
  }
}

function normalizeIpAddress(ipAddress: string) {
  const normalized = ipAddress.trim();
  if (!normalized) return "127.0.0.1";
  if (normalized.startsWith("::ffff:")) return normalized.slice(7);
  return normalized === "::1" ? "127.0.0.1" : normalized;
}
