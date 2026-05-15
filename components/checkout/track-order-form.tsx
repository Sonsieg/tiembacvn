"use client";

import { useEffect, useRef, useState } from "react";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { fulfillmentStatusLabels, paymentStatusLabels } from "@/lib/utils/order-workflow";
import type { Order } from "@/types/commerce";

export function TrackOrderForm({ initialOrder }: { initialOrder?: string }) {
  const toast = useToast();
  const orderNumberRef = useRef<HTMLInputElement>(null);
  const emailOrPhoneRef = useRef<HTMLInputElement>(null);
  const [orderNumber, setOrderNumber] = useState(initialOrder ?? "");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canSubmit = orderNumber.trim().length >= 4 && emailOrPhone.trim().length >= 5 && !loading;

  useEffect(() => {
    const syncAutofill = () => {
      const nextOrderNumber = orderNumberRef.current?.value ?? "";
      const nextEmailOrPhone = emailOrPhoneRef.current?.value ?? "";
      if (nextOrderNumber && nextOrderNumber !== orderNumber) setOrderNumber(nextOrderNumber.toUpperCase());
      if (nextEmailOrPhone && nextEmailOrPhone !== emailOrPhone) setEmailOrPhone(nextEmailOrPhone);
    };
    syncAutofill();
    const timeout = window.setTimeout(syncAutofill, 250);
    const interval = window.setInterval(syncAutofill, 750);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [orderNumber, emailOrPhone]);

  function syncInputValues() {
    const nextOrderNumber = (orderNumberRef.current?.value ?? orderNumber).toUpperCase();
    const nextEmailOrPhone = emailOrPhoneRef.current?.value ?? emailOrPhone;
    setOrderNumber(nextOrderNumber);
    setEmailOrPhone(nextEmailOrPhone);
    return { orderNumber: nextOrderNumber.trim(), emailOrPhone: nextEmailOrPhone.trim() };
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const values = syncInputValues();
    if (values.orderNumber.length < 4 || values.emailOrPhone.length < 5 || loading) return;
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data.error ?? "Không tìm thấy đơn hàng";
        setError(message);
        toast({ tone: "danger", title: "Tra cứu thất bại", description: message });
        return;
      }
      setOrder(data.order);
      toast({ tone: "success", title: "Đã tìm thấy đơn hàng", description: data.order.orderNumber });
    } catch {
      const message = "Không thể kết nối để tra cứu đơn hàng. Vui lòng thử lại.";
      setError(message);
      toast({ tone: "danger", title: "Tra cứu thất bại", description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <Card className="h-fit p-5">
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Mã đơn hàng" required><Input ref={orderNumberRef} value={orderNumber} onInput={syncInputValues} onChange={(event) => setOrderNumber(event.target.value.toUpperCase())} placeholder="TB20260512001" /></Field>
          <Field label="Email hoặc số điện thoại" required hint="Nếu mở từ trang đặt hàng thành công, mã đơn đã được điền sẵn. Bạn vẫn cần nhập đúng email hoặc số điện thoại đã dùng khi đặt hàng."><Input ref={emailOrPhoneRef} value={emailOrPhone} onInput={syncInputValues} onChange={(event) => setEmailOrPhone(event.target.value)} placeholder="Email hoặc SĐT khi đặt hàng" /></Field>
          {error ? <p className="rounded-sm border border-claret/40 bg-claret/10 p-3 text-sm text-claret">{error}</p> : null}
          <Button disabled={!canSubmit}><PackageSearch className="h-4 w-4" /> {loading ? "Đang tra cứu..." : "Tra cứu"}</Button>
        </form>
      </Card>
      <Card className="min-h-80 p-5">
        {order ? (
          <div className="grid gap-5">
            <div><p className="eyebrow">Đơn hàng {order.orderNumber}</p><h2 className="text-2xl font-semibold text-foreground">{formatCurrency(order.grandTotal)}</h2><p className="text-sm text-gray-500">{paymentStatusLabels[order.paymentStatus]} · {fulfillmentStatusLabels[order.fulfillmentStatus]}</p></div>
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
