"use client";

import { useEffect } from "react";
import { saveLocalOrder } from "@/lib/client/order-history";
import type { Order } from "@/types/commerce";

export function OrderHistorySync({ order }: { order: Order | null }) {
  useEffect(() => {
    if (order) saveLocalOrder(order, order.customer.phone);
  }, [order]);

  return null;
}
