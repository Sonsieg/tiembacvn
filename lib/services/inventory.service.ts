import type { CartItem } from "@/types/commerce";
import { getProductById } from "./product.service";

export async function reserveInventory(items: Pick<CartItem, "productId" | "variantId" | "quantity">[]) {
  for (const item of items) {
    const product = await getProductById(item.productId);
    const variant = product?.variants.find((entry) => entry.id === item.variantId);
    if (!product || product.status !== "active" || !variant?.active) {
      return { ok: false, message: "Sản phẩm không còn khả dụng" };
    }
    const sellable = variant.inventory.quantityAvailable - variant.inventory.quantityReserved;
    if (sellable < item.quantity) {
      return { ok: false, message: `${product?.title} chỉ còn ${Math.max(sellable, 0)} sản phẩm` };
    }
  }

  // Production path: update inventory_items.quantity_reserved in a transaction/RPC.
  return { ok: true, message: "Đã giữ tồn kho" };
}

export async function releaseInventory(orderId: string) {
  // Production path: find reserved order items then decrement quantity_reserved.
  return { ok: true, message: `Đã hoàn tồn kho cho đơn ${orderId}` };
}
