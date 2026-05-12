"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Order } from "@/types/commerce";

export function TrackOrderForm({ initialOrder }: { initialOrder?: string }) {
  const [orderNumber, setOrderNumber] = useState(initialOrder ?? "");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setOrder(null);
    const response = await fetch("/api/track-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, emailOrPhone }),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error ?? "Không tìm thấy đơn hàng");
    setOrder(data.order);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <Card className="h-fit p-5">
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Mã đơn hàng"><Input value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} placeholder="TB20260512001" /></Field>
          <Field label="Email hoặc số điện thoại"><Input value={emailOrPhone} onChange={(event) => setEmailOrPhone(event.target.value)} placeholder="email@sdt" /></Field>
          {error ? <p className="rounded-sm border border-claret/40 bg-claret/10 p-3 text-sm text-claret">{error}</p> : null}
          <Button><PackageSearch className="h-4 w-4" /> Tra cứu</Button>
        </form>
      </Card>
      <Card className="min-h-80 p-5">
        {order ? (
          <div className="grid gap-5">
            <div><p className="eyebrow">Đơn hàng {order.orderNumber}</p><h2 className="text-2xl font-semibold text-foreground">{formatCurrency(order.grandTotal)}</h2><p className="text-sm text-gray-500">{order.paymentStatus === "paid" ? "Đã thanh toán" : "Chờ thanh toán"} · {order.fulfillmentStatus}</p></div>
            <div className="grid gap-3">
              {order.timeline.map((item) => <div key={item.at} className="border-l-2 border-claret pl-4"><b className="text-foreground">{item.label}</b><p className="text-sm text-gray-500">{formatDate(item.at)}</p></div>)}
            </div>
            <div className="grid gap-3">
              {order.items.map((item) => <div key={item.variantId} className="flex gap-3 rounded-sm border border-silver-200 bg-white/5 p-3"><img src={item.image} alt={item.title} className="h-14 w-14 rounded-sm object-cover" /><div className="flex-1"><b>{item.title}</b><p className="text-sm text-gray-500">{item.variantTitle} x {item.quantity}</p></div><b>{formatCurrency(item.totalPrice)}</b></div>)}
            </div>
            <p className="text-sm text-gray-600">Giao đến: {order.address.addressLine}, {order.address.ward}, {order.address.district}, {order.address.province}</p>
          </div>
        ) : (
          <div className="grid h-full place-items-center text-center text-gray-500">Nhập mã đơn hàng và thông tin liên hệ để xem timeline.</div>
        )}
      </Card>
    </div>
  );
}
