import type { Coupon } from "@/types/commerce";

export const mockCoupons: Coupon[] = [
  {
    id: "coupon-welcome",
    code: "TB-WELCOME10",
    type: "percentage",
    value: 10,
    minOrderTotal: 500000,
    usageLimit: 500,
    used: 83,
    active: true,
  },
  {
    id: "coupon-ship",
    code: "TB-FREESHIP",
    type: "free_shipping",
    value: 0,
    minOrderTotal: 300000,
    usageLimit: 300,
    used: 122,
    active: true,
  },
];

export async function getCoupons() {
  return mockCoupons;
}

export async function validateCoupon(code: string | undefined, subtotal: number) {
  if (!code) return { coupon: null, discount: 0, freeShipping: false, message: "" };
  const coupon = mockCoupons.find((item) => item.code.toLowerCase() === code.toLowerCase() && item.active);
  if (!coupon) return { coupon: null, discount: 0, freeShipping: false, message: "Mã giảm giá không hợp lệ" };
  if (subtotal < coupon.minOrderTotal) {
    return { coupon: null, discount: 0, freeShipping: false, message: `Đơn hàng cần đạt tối thiểu ${coupon.minOrderTotal.toLocaleString("vi-VN")}đ` };
  }
  if (coupon.used >= coupon.usageLimit) {
    return { coupon: null, discount: 0, freeShipping: false, message: "Mã giảm giá đã hết lượt sử dụng" };
  }
  if (coupon.type === "percentage") return { coupon, discount: Math.round((subtotal * coupon.value) / 100), freeShipping: false, message: "Đã áp dụng mã giảm giá" };
  if (coupon.type === "fixed_amount") return { coupon, discount: coupon.value, freeShipping: false, message: "Đã áp dụng mã giảm giá" };
  return { coupon, discount: 0, freeShipping: true, message: "Đã áp dụng miễn phí vận chuyển" };
}
