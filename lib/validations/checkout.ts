import { z } from "zod";

export const checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2, "Vui lòng nhập họ tên"),
    phone: z.string().min(9, "Số điện thoại chưa hợp lệ"),
    email: z.string().email("Email chưa hợp lệ"),
  }),
  address: z.object({
    addressLine: z.string().min(6, "Vui lòng nhập địa chỉ"),
    ward: z.string().min(2, "Vui lòng nhập phường/xã"),
    district: z.string().min(2, "Vui lòng nhập quận/huyện"),
    province: z.string().min(2, "Vui lòng nhập tỉnh/thành phố"),
    note: z.string().optional(),
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
