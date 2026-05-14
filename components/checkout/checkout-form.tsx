"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Check, CreditCard, Landmark, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { CartSummary } from "@/components/cart/cart-summary";
import { useToast } from "@/components/ui/toast";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils/format";

export function CheckoutForm() {
  const router = useRouter();
  const toast = useToast();
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const clearCart = useCartStore((state) => state.clearCart);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [idempotencyKey] = useState(() => createIdempotencyKey());
  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer: { fullName: "", phone: "", email: "" },
      address: { addressLine: "", ward: "", district: "", province: "", note: "" },
      paymentMethod: "cod",
      couponCode,
      items: [],
    },
  });
  const paymentMethod = useWatch({ control: form.control, name: "paymentMethod" });

  async function submit(values: CheckoutInput) {
    if (loading) return;
    setError("");
    setLoading(true);
    const payload = {
      ...values,
      couponCode,
      idempotencyKey,
      items: items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })),
    };
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data.error ?? "Không thể tạo đơn hàng. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.";
        setError(message);
        toast({ tone: "danger", title: "Đặt hàng thất bại", description: message });
        return;
      }
      toast({ tone: "success", title: "Đã tạo đơn hàng", description: `Mã đơn ${data.order.orderNumber}.` });
      clearCart();
      router.push(`/order-success?order=${data.order.orderNumber}`);
    } catch {
      const message = "Kết nối không ổn định. Đơn hàng chưa được xác nhận trên trình duyệt này, vui lòng thử lại.";
      setError(message);
      toast({ tone: "danger", title: "Không thể kết nối", description: message });
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="grid gap-4 rounded-sm border border-line bg-pearl p-6 text-slate shadow-soft">
        <h2 className="font-display text-3xl font-semibold text-ink">Giỏ hàng đang trống</h2>
        <p className="text-sm text-slate-muted">Vui lòng chọn sản phẩm trước khi đặt hàng.</p>
      </div>
    );
  }

  const disabled = loading;

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]" aria-busy={loading}>
      <input type="hidden" {...form.register("paymentMethod")} />
      <div className="grid gap-5">
        <Panel eyebrow="Bước 1" title="Thông tin liên hệ" description="Thông tin này dùng để xác nhận đơn và hỗ trợ tra cứu sau khi đặt hàng.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Họ và tên" error={form.formState.errors.customer?.fullName?.message}><Input disabled={disabled} {...form.register("customer.fullName")} /></Field>
            <Field label="Số điện thoại" error={form.formState.errors.customer?.phone?.message}><Input disabled={disabled} {...form.register("customer.phone")} /></Field>
            <div className="md:col-span-2"><Field label="Email" error={form.formState.errors.customer?.email?.message}><Input disabled={disabled} type="email" {...form.register("customer.email")} /></Field></div>
          </div>
        </Panel>
        <Panel eyebrow="Bước 2" title="Địa chỉ nhận hàng" description="Vui lòng nhập địa chỉ rõ ràng để shop xác nhận và giao đúng khu vực.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Địa chỉ" error={form.formState.errors.address?.addressLine?.message}><Input disabled={disabled} {...form.register("address.addressLine")} /></Field>
            <Field label="Phường/xã" error={form.formState.errors.address?.ward?.message}><Input disabled={disabled} {...form.register("address.ward")} /></Field>
            <Field label="Quận/huyện" error={form.formState.errors.address?.district?.message}><Input disabled={disabled} {...form.register("address.district")} /></Field>
            <Field label="Tỉnh/thành phố" error={form.formState.errors.address?.province?.message}><Input disabled={disabled} {...form.register("address.province")} /></Field>
            <div className="md:col-span-2"><Field label="Ghi chú đơn hàng"><Textarea disabled={disabled} className="min-h-32" {...form.register("address.note")} /></Field></div>
          </div>
        </Panel>
        <Panel eyebrow="Bước 3" title="Giao hàng & thanh toán" description="Chọn phương thức phù hợp. Hệ thống giữ tồn kho khi bạn bấm đặt hàng.">
          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <InfoTile icon={<PackageCheck className="h-5 w-5" />} title="Giao tiêu chuẩn" text="Shop xác nhận trước khi gửi hàng." />
              <InfoTile icon={<Truck className="h-5 w-5" />} title="Miễn phí từ ngưỡng" text="Tự động tính lại ở server." />
              <InfoTile icon={<ShieldCheck className="h-5 w-5" />} title="Không cần tài khoản" text="Tra cứu bằng mã đơn và liên hệ." />
            </div>
            <div className="grid gap-3">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-muted">Phương thức thanh toán</p>
              <div className="grid gap-3 md:grid-cols-3">
                {paymentOptions.map((option) => {
                  const active = paymentMethod === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={disabled}
                      className={cn(
                        "grid min-h-36 gap-3 rounded-sm border bg-pearl p-4 text-left transition",
                        "hover:border-cta hover:bg-cta-soft/20 focus:outline-none focus:ring-2 focus:ring-cta/25 disabled:cursor-not-allowed disabled:opacity-70",
                        active ? "border-cta bg-cta-soft/35 shadow-soft" : "border-line",
                      )}
                      onClick={() => form.setValue("paymentMethod", option.value, { shouldDirty: true, shouldValidate: true })}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className={cn("grid h-10 w-10 place-items-center rounded-sm border", active ? "border-cta bg-cta text-navy" : "border-line bg-ivory-soft text-cta")}>{option.icon}</span>
                        <span className={cn("grid h-6 w-6 place-items-center rounded-full border", active ? "border-cta bg-cta text-navy" : "border-line text-transparent")}><Check className="h-4 w-4" /></span>
                      </span>
                      <span>
                        <b className="block text-base text-ink">{option.label}</b>
                        <span className="mt-1 block text-sm leading-6 text-slate-muted">{option.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Panel>
        {error ? <div className="rounded-sm border border-claret/40 bg-claret/10 p-4 text-sm text-claret">{error}</div> : null}
      </div>
      <div className="grid h-fit gap-4 lg:sticky lg:top-24">
        <CartSummary />
        <Button type="submit" disabled={loading || !items.length} className="w-full" size="lg"><CreditCard className="h-4 w-4" /> {loading ? "Đang giữ hàng và tạo đơn..." : "Đặt hàng"}</Button>
        {loading ? <p className="text-center text-xs text-slate-muted">Vui lòng không đóng trang trong lúc hệ thống xác nhận tồn kho.</p> : null}
      </div>
    </form>
  );
}

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `checkout-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const paymentOptions = [
  {
    value: "cod" as const,
    label: "Thanh toán khi nhận hàng",
    description: "Shop gọi xác nhận, khách thanh toán khi nhận sản phẩm.",
    icon: <Banknote className="h-5 w-5" />,
  },
  {
    value: "bank_transfer" as const,
    label: "Chuyển khoản ngân hàng",
    description: "Phù hợp đơn cần xác nhận nhanh hoặc đặt làm quà.",
    icon: <Landmark className="h-5 w-5" />,
  },
  {
    value: "online" as const,
    label: "VNPay / online",
    description: "Sẵn sàng cho cổng thanh toán online ở bước tiếp theo.",
    icon: <CreditCard className="h-5 w-5" />,
  },
];

function Panel({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-sm border border-line bg-pearl p-5 text-slate shadow-soft md:p-6">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-cta">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-none text-navy md:text-4xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}

function InfoTile({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-sm border border-line bg-ivory-soft p-4">
      <span className="text-cta">{icon}</span>
      <b className="mt-3 block text-sm text-ink">{title}</b>
      <p className="mt-1 text-sm leading-6 text-slate-muted">{text}</p>
    </div>
  );
}
