import { siteConfig } from "@/lib/constants/site";
import { validateCoupon } from "@/lib/services/coupon.service";
import { reserveInventory } from "@/lib/services/inventory.service";
import { getProductById } from "@/lib/services/product.service";
import type { CheckoutInput } from "@/lib/validations/checkout";
import type { CartItem, Order, OrderItemSnapshot } from "@/types/commerce";

export async function calculateOrderTotals(items: Pick<CartItem, "productId" | "variantId" | "quantity">[], couponCode?: string) {
  let subtotal = 0;
  const snapshots: OrderItemSnapshot[] = [];

  for (const item of items) {
    const product = await getProductById(item.productId);
    const variant = product?.variants.find((entry) => entry.id === item.variantId && entry.active);
    if (!product || product.status !== "active" || !variant) throw new Error("Sản phẩm trong giỏ hàng không còn khả dụng");
    const totalPrice = variant.price * item.quantity;
    subtotal += totalPrice;
    snapshots.push({
      productId: product.id,
      variantId: variant.id,
      productSlug: product.slug,
      title: product.title,
      variantTitle: variant.title,
      sku: variant.sku,
      image: product.images[0],
      unitPrice: variant.price,
      compareAtPrice: variant.compareAtPrice,
      quantity: item.quantity,
      totalPrice,
    });
  }

  const coupon = await validateCoupon(couponCode, subtotal);
  const shippingFee = coupon.freeShipping || subtotal >= siteConfig.freeShippingThreshold ? 0 : siteConfig.shippingFee;
  const discountTotal = Math.min(coupon.discount, subtotal);

  return {
    snapshots,
    subtotal,
    discountTotal,
    shippingFee,
    grandTotal: subtotal - discountTotal + shippingFee,
    coupon,
  };
}

export async function createCheckoutOrder(input: CheckoutInput): Promise<Order> {
  const inventory = await reserveInventory(input.items);
  if (!inventory.ok) throw new Error(inventory.message);

  const totals = await calculateOrderTotals(input.items, input.couponCode);
  const now = new Date();
  const orderNumber = `TB${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getTime()).slice(-5)}`;

  // Product, variant, SKU, image and unit price are intentionally snapshotted
  // so future catalog edits never mutate the historical order record.
  return {
    id: `order-${orderNumber}`,
    orderNumber,
    idempotencyKey: input.idempotencyKey,
    customer: input.customer,
    address: input.address,
    items: totals.snapshots,
    subtotal: totals.subtotal,
    discountTotal: totals.discountTotal,
    shippingFee: totals.shippingFee,
    grandTotal: totals.grandTotal,
    couponCode: totals.coupon.coupon?.code,
    paymentMethod: input.paymentMethod,
    paymentStatus: "pending",
    orderStatus: "pending",
    fulfillmentStatus: "unfulfilled",
    timeline: [{ label: "Đã đặt hàng", at: now.toISOString(), note: "Tiembac.vn đã nhận đơn hàng của bạn." }],
    createdAt: now.toISOString(),
  };
}
