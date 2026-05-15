"use client";

import { useEffect, useRef, useState } from "react";
import { Clock3, PackageSearch, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { fulfillmentStatusLabels, paymentStatusLabels } from "@/lib/utils/order-workflow";
import { getLocalOrders, removeLocalOrder, saveLocalOrder, type LocalOrderSnapshot } from "@/lib/client/order-history";
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
  const [activeTab, setActiveTab] = useState<"saved" | "manual">(() => initialOrder ? "manual" : "saved");
  const [localOrders, setLocalOrders] = useState<LocalOrderSnapshot[]>(() => getLocalOrders());
  const [syncingLocal, setSyncingLocal] = useState(false);
  const canSubmit = orderNumber.trim().length >= 4 && emailOrPhone.trim().length >= 5 && !loading;

  useEffect(() => {
    if (localOrders.length > 0) void syncLocalOrders(localOrders);
    // Sync once on mount from the storage snapshot captured during initial render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      saveLocalOrder(data.order, values.emailOrPhone);
      setLocalOrders(getLocalOrders());
      toast({ tone: "success", title: "Đã tìm thấy đơn hàng", description: data.order.orderNumber });
    } catch {
      const message = "Không thể kết nối để tra cứu đơn hàng. Vui lòng thử lại.";
      setError(message);
      toast({ tone: "danger", title: "Tra cứu thất bại", description: message });
    } finally {
      setLoading(false);
    }
  }

  async function syncLocalOrders(orders = localOrders) {
    if (!orders.length || syncingLocal) return;
    setSyncingLocal(true);
    try {
      const synced = await Promise.all(orders.map((snapshot) => fetchTrackedOrder(snapshot)));
      const firstOrder = synced.find((item): item is Order => Boolean(item));
      if (firstOrder && !order) setOrder(firstOrder);
      setLocalOrders(getLocalOrders());
    } finally {
      setSyncingLocal(false);
    }
  }

  async function openLocalOrder(snapshot: LocalOrderSnapshot) {
    setError("");
    setLoading(true);
    try {
      const trackedOrder = await fetchTrackedOrder(snapshot);
      if (!trackedOrder) {
        const message = "Không thể cập nhật đơn này. Bạn vẫn có thể tra cứu lại bằng mã đơn và số điện thoại.";
        setError(message);
        toast({ tone: "danger", title: "Chưa cập nhật được đơn", description: message });
        return;
      }
      setOrder(trackedOrder);
      setOrderNumber(trackedOrder.orderNumber);
      setEmailOrPhone(snapshot.contact);
      setLocalOrders(getLocalOrders());
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrackedOrder(snapshot: LocalOrderSnapshot) {
    const response = await fetch("/api/track-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber: snapshot.orderNumber, emailOrPhone: snapshot.contact }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    saveLocalOrder(data.order, snapshot.contact);
    return data.order as Order;
  }

  function forgetLocalOrder(orderNumber: string) {
    removeLocalOrder(orderNumber);
    const next = getLocalOrders();
    setLocalOrders(next);
    if (order?.orderNumber === orderNumber) setOrder(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <Card className="h-fit p-5">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 rounded-sm border border-line bg-ivory-soft p-1 text-sm font-bold uppercase tracking-[.12em]">
            <button type="button" className={activeTab === "saved" ? "rounded-sm bg-pearl px-3 py-2 text-ink shadow-soft" : "px-3 py-2 text-slate-muted"} onClick={() => setActiveTab("saved")}>Đơn đã đặt</button>
            <button type="button" className={activeTab === "manual" ? "rounded-sm bg-pearl px-3 py-2 text-ink shadow-soft" : "px-3 py-2 text-slate-muted"} onClick={() => setActiveTab("manual")}>Tra cứu</button>
          </div>

          {activeTab === "saved" ? (
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <b className="text-ink">Đơn trên máy này</b>
                  <p className="text-sm text-gray-500">Danh sách lưu trên trình duyệt hiện tại.</p>
                </div>
                <Button type="button" variant="secondary" size="sm" disabled={!localOrders.length || syncingLocal} onClick={() => syncLocalOrders()}>
                  <RefreshCw className="h-4 w-4" /> {syncingLocal ? "Đang cập nhật" : "Cập nhật"}
                </Button>
              </div>
              {localOrders.length ? (
                <div className="grid gap-3">
                  {localOrders.map((snapshot) => (
                    <div key={snapshot.orderNumber} className="grid gap-3 rounded-sm border border-line bg-pearl p-4">
                      <button type="button" className="grid gap-1 text-left" onClick={() => openLocalOrder(snapshot)}>
                        <span className="flex items-center justify-between gap-3">
                          <b className="text-ink">{snapshot.orderNumber}</b>
                          <span className="text-sm font-semibold text-cta">{formatCurrency(snapshot.grandTotal)}</span>
                        </span>
                        <span className="text-sm text-gray-500">{paymentStatusLabels[snapshot.paymentStatus]} · {fulfillmentStatusLabels[snapshot.fulfillmentStatus]}</span>
                        <span className="flex items-center gap-2 text-xs text-gray-500"><Clock3 className="h-3.5 w-3.5" /> {formatDate(snapshot.createdAt)}</span>
                      </button>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={() => openLocalOrder(snapshot)} disabled={loading}>Xem đơn</Button>
                        <Button type="button" size="sm" variant="secondary" onClick={() => forgetLocalOrder(snapshot.orderNumber)}>
                          <Trash2 className="h-4 w-4" /> Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-sm border border-dashed border-line p-4 text-sm text-gray-500">Chưa có đơn nào được lưu trên trình duyệt này.</div>
              )}
              {error ? <p className="rounded-sm border border-claret/40 bg-claret/10 p-3 text-sm text-claret">{error}</p> : null}
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <Field label="Mã đơn hàng" required><Input ref={orderNumberRef} value={orderNumber} onInput={syncInputValues} onChange={(event) => setOrderNumber(event.target.value.toUpperCase())} placeholder="TB20260512001" /></Field>
              <Field label="Email hoặc số điện thoại" required hint="Nếu mở từ trang đặt hàng thành công, mã đơn đã được điền sẵn. Bạn vẫn cần nhập đúng email hoặc số điện thoại đã dùng khi đặt hàng."><Input ref={emailOrPhoneRef} value={emailOrPhone} onInput={syncInputValues} onChange={(event) => setEmailOrPhone(event.target.value)} placeholder="Email hoặc SĐT khi đặt hàng" /></Field>
              {error ? <p className="rounded-sm border border-claret/40 bg-claret/10 p-3 text-sm text-claret">{error}</p> : null}
              <Button type="submit" disabled={!canSubmit}><PackageSearch className="h-4 w-4" /> {loading ? "Đang tra cứu..." : "Tra cứu"}</Button>
            </form>
          )}
        </div>
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
