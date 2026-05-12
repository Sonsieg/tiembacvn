import type { Order } from "@/types/commerce";

export const orders: Order[] = [
  {
    id: "order-demo",
    orderNumber: "TB20260512001",
    customer: {
      fullName: "Nguyễn An",
      phone: "0909888925",
      email: "an@example.com",
    },
    address: {
      addressLine: "24 Nguyễn Trãi",
      ward: "Bến Thành",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      note: "Gọi trước khi giao.",
    },
    items: [
      {
        productId: "moonlight",
        variantId: "moonlight-v-1",
        productSlug: "nhan-bac-s925-moonlight",
        title: "Nhẫn bạc S925 Moonlight",
        variantTitle: "Size 5",
        sku: "TB-MOONLIGHT-5",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
        unitPrice: 420000,
        quantity: 1,
        totalPrice: 420000,
      },
    ],
    subtotal: 420000,
    discountTotal: 0,
    shippingFee: 30000,
    grandTotal: 450000,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "confirmed",
    fulfillmentStatus: "packed",
    timeline: [
      { label: "Đã đặt hàng", at: "2026-05-12T09:00:00.000Z" },
      { label: "Đã xác nhận", at: "2026-05-12T09:30:00.000Z" },
      { label: "Đang chuẩn bị hàng", at: "2026-05-12T11:00:00.000Z" },
    ],
    createdAt: "2026-05-12T09:00:00.000Z",
  },
];
