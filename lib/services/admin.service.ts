import { getOrders } from "@/lib/services/order.service";
import { getProducts } from "@/lib/services/product.service";

export async function getAdminDashboard() {
  const [orders, products] = await Promise.all([getOrders(), getProducts()]);
  const revenue = orders.reduce((total, order) => total + order.grandTotal, 0);
  const pendingOrders = orders.filter((order) => order.orderStatus === "pending").length;
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;
  const lowStock = products.flatMap((product) =>
    product.variants
      .filter((variant) => variant.inventory.quantityAvailable - variant.inventory.quantityReserved <= variant.inventory.lowStockThreshold)
      .map((variant) => ({ product, variant })),
  );

  return {
    revenue,
    todayOrders: orders.length,
    pendingOrders,
    paidOrders,
    lowStock,
    recentOrders: orders.slice(0, 10),
    bestSellers: products.filter((product) => product.bestSeller).slice(0, 5),
  };
}
