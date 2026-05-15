"use client";

import type { Order, PaymentMethod, PaymentStatus, FulfillmentStatus } from "@/types/commerce";

const storageKey = "tiembac:local-orders:v1";
const maxOrders = 20;

export type LocalOrderSnapshot = {
  orderNumber: string;
  contact: string;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  lastSyncedAt: string;
};

export function saveLocalOrder(order: Order, contact?: string) {
  const nextContact = contact?.trim() || order.customer.phone || order.customer.email;
  if (!order.orderNumber || !nextContact) return;
  upsertLocalOrder({
    orderNumber: order.orderNumber,
    contact: nextContact,
    grandTotal: order.grandTotal,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    createdAt: order.createdAt,
    lastSyncedAt: new Date().toISOString(),
  });
}

export function upsertLocalOrder(snapshot: LocalOrderSnapshot) {
  const orders = getLocalOrders();
  const normalizedOrderNumber = snapshot.orderNumber.toUpperCase();
  const existing = orders.find((order) => order.orderNumber.toUpperCase() === normalizedOrderNumber);
  const merged = existing ? { ...existing, ...snapshot, orderNumber: normalizedOrderNumber } : { ...snapshot, orderNumber: normalizedOrderNumber };
  const next = [merged, ...orders.filter((order) => order.orderNumber.toUpperCase() !== normalizedOrderNumber)]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxOrders);
  writeLocalOrders(next);
}

export function getLocalOrders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLocalOrderSnapshot);
  } catch {
    return [];
  }
}

export function removeLocalOrder(orderNumber: string) {
  const normalizedOrderNumber = orderNumber.toUpperCase();
  writeLocalOrders(getLocalOrders().filter((order) => order.orderNumber.toUpperCase() !== normalizedOrderNumber));
}

function writeLocalOrders(orders: LocalOrderSnapshot[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(orders));
  } catch {
    // Ignore storage quota/private-mode failures; tracking by code still works.
  }
}

function isLocalOrderSnapshot(value: unknown): value is LocalOrderSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<LocalOrderSnapshot>;
  return Boolean(
    candidate.orderNumber &&
      candidate.contact &&
      typeof candidate.grandTotal === "number" &&
      candidate.paymentMethod &&
      candidate.paymentStatus &&
      candidate.fulfillmentStatus &&
      candidate.createdAt &&
      candidate.lastSyncedAt,
  );
}
