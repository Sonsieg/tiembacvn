import { orders } from "@/data/mock-orders";
import { createCheckoutOrder } from "@/lib/services/checkout.service";
import type { CheckoutInput } from "@/lib/validations/checkout";
import type { Order } from "@/types/commerce";

const runtimeOrders: Order[] = [...orders];

export async function createOrder(input: CheckoutInput) {
  const order = await createCheckoutOrder(input);
  runtimeOrders.unshift(order);
  return order;
}

export async function getOrders() {
  return runtimeOrders;
}

export async function getOrderById(id: string) {
  return runtimeOrders.find((order) => order.id === id || order.orderNumber === id) ?? null;
}

export async function trackOrder(orderNumber: string, emailOrPhone: string) {
  const needle = emailOrPhone.trim().toLowerCase();
  return (
    runtimeOrders.find(
      (order) =>
        order.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() &&
        (order.customer.email.toLowerCase() === needle || order.customer.phone.replace(/\s/g, "") === needle.replace(/\s/g, "")),
    ) ?? null
  );
}
