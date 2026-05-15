import { z } from "zod";

const disposableEmailDomains = new Set([
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
]);

export const checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(80, "Họ tên quá dài"),
    phone: z.string()
      .trim()
      .transform(normalizeVietnamPhone)
      .refine(isValidVietnamPhone, "Số điện thoại Việt Nam chưa hợp lệ"),
    email: z.string()
      .trim()
      .toLowerCase()
      .max(254, "Email quá dài")
      .email("Email chưa hợp lệ")
      .refine((value) => !hasSuspiciousEmailPattern(value), "Email có định dạng không hợp lệ")
      .refine((value) => !isDisposableEmail(value), "Vui lòng dùng email chính, không dùng email tạm"),
  }),
  address: z.object({
    addressLine: z.string().trim().min(6, "Vui lòng nhập địa chỉ").max(180, "Địa chỉ quá dài"),
    ward: z.string().trim().min(2, "Vui lòng nhập phường/xã").max(80, "Phường/xã quá dài"),
    district: z.string().trim().min(2, "Vui lòng nhập quận/huyện").max(80, "Quận/huyện quá dài"),
    province: z.string().trim().min(2, "Vui lòng nhập tỉnh/thành phố").max(80, "Tỉnh/thành phố quá dài"),
    note: z.string().trim().max(500, "Ghi chú quá dài").optional(),
  }),
  paymentMethod: z.enum(["cod", "bank_transfer", "online"]),
  couponCode: z.string().optional(),
  idempotencyKey: z.string().min(12).max(120).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Giỏ hàng đang trống"),
});

export const trackOrderSchema = z.object({
  orderNumber: z.string().min(4, "Vui lòng nhập mã đơn hàng"),
  emailOrPhone: z.string().min(5, "Vui lòng nhập email hoặc số điện thoại"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type TrackOrderInput = z.infer<typeof trackOrderSchema>;

function normalizeVietnamPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("84")) return `0${digits.slice(2)}`;
  if (digits.startsWith("0084")) return `0${digits.slice(4)}`;
  return digits;
}

function isValidVietnamPhone(value: string) {
  // Mobile: 03, 05, 07, 08, 09 + 8 digits. Landline: 02 + 8-9 digits.
  return /^(0(3|5|7|8|9)\d{8}|02\d{8,9})$/.test(value);
}

function hasSuspiciousEmailPattern(value: string) {
  const [localPart] = value.split("@");
  return value.includes("..") || localPart.startsWith(".") || localPart.endsWith(".");
}

function isDisposableEmail(value: string) {
  const domain = value.split("@")[1]?.toLowerCase();
  return Boolean(domain && disposableEmailDomains.has(domain));
}
