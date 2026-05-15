import { orders } from "@/data/mock-orders";
import { createCheckoutOrder } from "@/lib/services/checkout.service";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CheckoutInput } from "@/lib/validations/checkout";
import type { FulfillmentStatus, Order, OrderStatusUpdateInput, PaymentMethod, OrderStatus, PaymentStatus } from "@/types/commerce";

type DbRow = Record<string, unknown>;

const runtimeOrders: Order[] = [...orders];
const runtimeIdempotency = new Map<string, string>();

export async function createOrder(input: CheckoutInput) {
  if (input.idempotencyKey) {
    const existingOrderNumber = runtimeIdempotency.get(input.idempotencyKey);
    if (existingOrderNumber) {
      const existing = await getOrderById(existingOrderNumber);
      if (existing) return existing;
    }
  }

  const order = await createCheckoutOrder(input);
  const supabase = createSupabaseAdminClient();

  if (supabase) {
    const persisted = await persistOrderAtomic(order);
    runtimeOrders.unshift(persisted);
    if (input.idempotencyKey) runtimeIdempotency.set(input.idempotencyKey, persisted.orderNumber);
    return persisted;
  }

  runtimeOrders.unshift(order);
  if (input.idempotencyKey) runtimeIdempotency.set(input.idempotencyKey, order.orderNumber);
  return order;
}

export async function getOrders() {
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), order_addresses(*), order_status_history(*)")
      .order("created_at", { ascending: false });
    if (!error && data) return data.map(mapOrderRow);
  }

  return runtimeOrders;
}

export async function getOrderById(id: string) {
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const byNumber = await fetchOrderByColumn("order_number", id);
    if (byNumber) return byNumber;

    if (isUuid(id)) {
      const byId = await fetchOrderByColumn("id", id);
      if (byId) return byId;
    }
  }

  return runtimeOrders.find((order) => order.id === id || order.orderNumber === id) ?? null;
}

export async function trackOrder(orderNumber: string, emailOrPhone: string) {
  const normalizedOrderNumber = orderNumber.trim().toUpperCase();
  const needle = emailOrPhone.trim().toLowerCase();
  const needlePhoneVariants = phoneVariants(emailOrPhone);
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const order = await fetchOrderByColumn("order_number", normalizedOrderNumber);
    if (!order) return null;
    return contactMatches(order, needle, needlePhoneVariants) ? order : null;
  }

  return (
    runtimeOrders.find(
      (order) =>
        order.orderNumber.toLowerCase() === normalizedOrderNumber.toLowerCase() &&
        contactMatches(order, needle, needlePhoneVariants),
    ) ?? null
  );
}

export async function updateOrderStatus(id: string, input: OrderStatusUpdateInput) {
  const current = await getOrderById(id);
  if (!current) return null;

  const next = {
    ...current,
    orderStatus: input.orderStatus ?? current.orderStatus,
    paymentStatus: input.paymentStatus ?? current.paymentStatus,
    fulfillmentStatus: input.fulfillmentStatus ?? current.fulfillmentStatus,
    timeline: [
      ...current.timeline,
      {
        label: statusTimelineLabel(input),
        at: new Date().toISOString(),
        note: input.note,
      },
    ],
  };

  const supabase = createSupabaseAdminClient();
  if (supabase) {
    if (current.orderStatus !== "cancelled" && next.orderStatus === "cancelled") {
      const { error } = await supabase.rpc("release_stock_for_order", { p_order_id: current.id });
      if (error) throw new Error(`Không thể hoàn tồn kho: ${error.message}. Hãy chạy lại supabase/schema.sql để cài RPC release_stock_for_order.`);
    }

    if (current.orderStatus !== "completed" && next.orderStatus === "completed") {
      const { error } = await supabase.rpc("complete_stock_for_order", { p_order_id: current.id });
      if (error) throw new Error(`Không thể chốt tồn kho: ${error.message}. Hãy chạy lại supabase/schema.sql để cài RPC complete_stock_for_order.`);
    }

    const patch = {
      order_status: next.orderStatus,
      payment_status: next.paymentStatus,
      fulfillment_status: next.fulfillmentStatus,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("orders").update(patch).eq(isUuid(id) ? "id" : "order_number", id);
    if (error) throw new Error(error.message);

    const order = await getOrderById(id);
    if (order) {
      await supabase.from("order_status_history").insert({
        order_id: order.id,
        status: next.orderStatus,
        note: input.note ?? statusTimelineLabel(input),
      });
      return (await getOrderById(id)) ?? next;
    }
  }

  const index = runtimeOrders.findIndex((order) => order.id === id || order.orderNumber === id);
  if (index >= 0) runtimeOrders[index] = next;
  return next;
}

export function isRevenueOrder(order: Order) {
  if (order.orderStatus === "cancelled" || order.paymentStatus === "refunded" || order.paymentStatus === "failed") return false;
  if (order.paymentMethod === "cod") return order.orderStatus === "completed";
  return order.paymentStatus === "paid";
}

async function persistOrderAtomic(order: Order) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return order;
  if (order.items.some((item) => !isUuid(item.productId) || !isUuid(item.variantId))) {
    throw new Error("Đơn hàng đang dùng mock product id, chưa thể ghi Supabase. Hãy seed sản phẩm thật vào Supabase trước khi bật SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data, error } = await supabase.rpc("create_checkout_order_atomic", {
    p_order: {
      orderNumber: order.orderNumber,
      idempotencyKey: order.idempotencyKey,
      customer: order.customer,
      address: order.address,
      items: order.items,
      subtotal: order.subtotal,
      discountTotal: order.discountTotal,
      shippingFee: order.shippingFee,
      grandTotal: order.grandTotal,
      couponCode: order.couponCode ?? "",
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      fulfillmentStatus: order.fulfillmentStatus,
    },
  });
  if (error) throw new Error(`Không thể tạo đơn hàng atomically: ${error.message}. Hãy chạy lại supabase/schema.sql để cài RPC create_checkout_order_atomic.`);

  const persisted = data ? await getOrderById(String(data)) : null;
  return persisted ?? order;
}

async function fetchOrderByColumn(column: "id" | "order_number", value: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), order_addresses(*), order_status_history(*)")
    .eq(column, value)
    .single();

  if (error || !data) return null;
  return mapOrderRow(data);
}

function mapOrderRow(row: DbRow): Order {
  const address = asDbRow(Array.isArray(row.order_addresses) ? row.order_addresses[0] : row.order_addresses);
  const items = dbRows(row.order_items);
  const history = dbRows(row.order_status_history);

  return {
    id: String(row.id),
    orderNumber: String(row.order_number),
    idempotencyKey: row.idempotency_key ? String(row.idempotency_key) : undefined,
    customer: {
      fullName: String(row.customer_name ?? ""),
      phone: String(row.customer_phone ?? ""),
      email: String(row.customer_email ?? ""),
    },
    address: {
      addressLine: String(address?.address_line ?? ""),
      ward: String(address?.ward ?? ""),
      district: String(address?.district ?? ""),
      province: String(address?.province ?? ""),
      note: address?.note ? String(address.note) : undefined,
    },
    items: items.map((item) => ({
      productId: String(item.product_id ?? ""),
      variantId: String(item.variant_id ?? ""),
      productSlug: "",
      title: String(item.product_title ?? ""),
      variantTitle: String(item.variant_title ?? ""),
      sku: String(item.sku ?? ""),
      image: String(item.image ?? ""),
      unitPrice: Number(item.unit_price ?? 0),
      quantity: Number(item.quantity ?? 0),
      totalPrice: Number(item.total_price ?? 0),
    })),
    subtotal: Number(row.subtotal ?? 0),
    discountTotal: Number(row.discount_total ?? 0),
    shippingFee: Number(row.shipping_fee ?? 0),
    grandTotal: Number(row.grand_total ?? 0),
    couponCode: row.coupon_code ? String(row.coupon_code) : undefined,
    paymentMethod: row.payment_method as PaymentMethod,
    paymentStatus: row.payment_status as PaymentStatus,
    orderStatus: row.order_status as OrderStatus,
    fulfillmentStatus: row.fulfillment_status as FulfillmentStatus,
    timeline: (history.length ? history : [{ status: row.order_status, created_at: row.created_at, note: "Đã đặt hàng" }])
      .sort((a, b) => new Date(String(a.created_at)).getTime() - new Date(String(b.created_at)).getTime())
      .map((entry) => ({ label: String(entry.status), at: String(entry.created_at), note: entry.note ? String(entry.note) : undefined })),
    createdAt: String(row.created_at),
  };
}

function dbRows(value: unknown): DbRow[] {
  return Array.isArray(value) ? value.filter((item): item is DbRow => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];
}

function asDbRow(value: unknown): DbRow | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as DbRow : null;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function contactMatches(order: Order, needle: string, needlePhoneVariants: Set<string>) {
  if (order.customer.email.trim().toLowerCase() === needle) return true;
  const orderPhoneVariants = phoneVariants(order.customer.phone);
  for (const variant of needlePhoneVariants) {
    if (orderPhoneVariants.has(variant)) return true;
  }
  return false;
}

function phoneVariants(value: string) {
  const digits = value.replace(/\D/g, "");
  const variants = new Set<string>();
  if (!digits) return variants;
  variants.add(digits);
  if (digits.startsWith("84")) variants.add(`0${digits.slice(2)}`);
  if (digits.startsWith("0")) variants.add(`84${digits.slice(1)}`);
  return variants;
}

function statusTimelineLabel(input: OrderStatusUpdateInput) {
  if (input.orderStatus) return `Cập nhật đơn: ${input.orderStatus}`;
  if (input.paymentStatus) return `Cập nhật thanh toán: ${input.paymentStatus}`;
  if (input.fulfillmentStatus) return `Cập nhật giao hàng: ${input.fulfillmentStatus}`;
  return "Cập nhật đơn hàng";
}
