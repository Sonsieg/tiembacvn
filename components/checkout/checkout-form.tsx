"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Check, CreditCard, Landmark, Loader2, PackageCheck, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { CartSummary } from "@/components/cart/cart-summary";
import { useToast } from "@/components/ui/toast";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils/format";
import { saveLocalOrder } from "@/lib/client/order-history";

export function CheckoutForm() {
  const router = useRouter();
  const toast = useToast();
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const clearCart = useCartStore((state) => state.clearCart);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectTimedOut, setRedirectTimedOut] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(25);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentOrderNumber, setPaymentOrderNumber] = useState("");
  const [idempotencyKey] = useState(() => createIdempotencyKey());
  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      customer: { fullName: "", phone: "", email: "" },
      address: { addressLine: "", ward: "", district: "", province: "", note: "" },
      paymentMethod: "cod",
      couponCode,
      items: [],
    },
  });
  const paymentMethod = useWatch({ control: form.control, name: "paymentMethod" });
  const canSubmit = items.length > 0 && !loading;
  const { setValue } = form;

  useEffect(() => {
    setValue(
      "items",
      items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })),
    );
    setValue("couponCode", couponCode);
  }, [couponCode, items, setValue]);

  useEffect(() => {
    if (!redirecting) return;
    const countdown = window.setInterval(() => {
      setRedirectCountdown((value) => Math.max(0, value - 1));
    }, 1000);
    const timeout = window.setTimeout(() => {
      setRedirectTimedOut(true);
    }, 25000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(timeout);
    };
  }, [redirecting, paymentUrl]);

  async function submit(values: CheckoutInput) {
    if (loading) return;
    setError("");
    setLoading(true);
    let keepBusy = false;
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
      saveLocalOrder(data.order, values.customer.phone);
      clearCart();
      if (data.paymentUrl) {
        keepBusy = true;
        startVnpayRedirect(data.paymentUrl, data.order.orderNumber);
        return;
      }
      router.push(`/order-success?order=${data.order.orderNumber}`);
    } catch {
      const message = "Kết nối không ổn định. Đơn hàng chưa được xác nhận trên trình duyệt này, vui lòng thử lại.";
      setError(message);
      toast({ tone: "danger", title: "Không thể kết nối", description: message });
    } finally {
      if (!keepBusy) setLoading(false);
    }
  }

  function startVnpayRedirect(nextPaymentUrl: string, orderNumber: string) {
    setPaymentUrl(nextPaymentUrl);
    setPaymentOrderNumber(orderNumber);
    setRedirectCountdown(25);
    setRedirectTimedOut(false);
    setRedirecting(true);
    window.setTimeout(() => {
      window.location.assign(nextPaymentUrl);
    }, 700);
  }

  async function retryVnpayRedirect() {
    if (!paymentOrderNumber) return;
    setRedirectTimedOut(false);
    setRedirectCountdown(25);
    try {
      const response = await fetch("/api/payment/vnpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: paymentOrderNumber }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không thể tạo lại liên kết VNPay");
      startVnpayRedirect(data.paymentUrl, data.orderNumber);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể kết nối VNPay. Vui lòng thử lại.";
      setError(message);
      toast({ tone: "danger", title: "Không thể mở VNPay", description: message });
      setRedirecting(false);
      setLoading(false);
    }
  }

  if (!items.length && !redirecting) {
    return (
      <div className="grid gap-4 rounded-sm border border-line bg-pearl p-6 text-slate shadow-soft">
        <h2 className="font-display text-3xl font-semibold text-ink">Giỏ hàng đang trống</h2>
        <p className="text-sm text-slate-muted">Vui lòng chọn sản phẩm trước khi đặt hàng.</p>
      </div>
    );
  }

  const disabled = loading;

  return (
    <>
      <form onSubmit={form.handleSubmit(submit)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]" aria-busy={loading}>
        <input type="hidden" {...form.register("paymentMethod")} />
        <div className="grid gap-5">
          <Panel eyebrow="Bước 1" title="Thông tin liên hệ" description="Thông tin này dùng để xác nhận đơn và hỗ trợ tra cứu sau khi đặt hàng.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Họ và tên" required error={form.formState.errors.customer?.fullName?.message}><Input disabled={disabled} autoComplete="name" {...form.register("customer.fullName")} /></Field>
              <Field label="Số điện thoại" required error={form.formState.errors.customer?.phone?.message} tooltip="Nhập số di động Việt Nam, ví dụ 0912345678.">
                <Input disabled={disabled} autoComplete="tel" inputMode="tel" maxLength={16} placeholder="0912345678" {...form.register("customer.phone")} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Email" required error={form.formState.errors.customer?.email?.message} tooltip="Dùng email chính để nhận xác nhận đơn hàng.">
                  <Input disabled={disabled} type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="ten@email.com" {...form.register("customer.email")} />
                </Field>
              </div>
            </div>
          </Panel>
          <Panel eyebrow="Bước 2" title="Địa chỉ nhận hàng" description="Vui lòng nhập địa chỉ rõ ràng để shop xác nhận và giao đúng khu vực.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Địa chỉ" required error={form.formState.errors.address?.addressLine?.message}><Input disabled={disabled} autoComplete="street-address" {...form.register("address.addressLine")} /></Field>
              <Field label="Phường/xã" required error={form.formState.errors.address?.ward?.message}><Input disabled={disabled} {...form.register("address.ward")} /></Field>
              <Field label="Quận/huyện" required error={form.formState.errors.address?.district?.message}><Input disabled={disabled} {...form.register("address.district")} /></Field>
              <Field label="Tỉnh/thành phố" required error={form.formState.errors.address?.province?.message}><Input disabled={disabled} autoComplete="address-level1" {...form.register("address.province")} /></Field>
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
          <Button type="submit" disabled={!canSubmit} className="w-full" size="lg"><CreditCard className="h-4 w-4" /> {loading ? "Đang giữ hàng và tạo đơn..." : "Đặt hàng"}</Button>
          {loading ? <p className="text-center text-xs text-slate-muted">Vui lòng không đóng trang trong lúc hệ thống xác nhận tồn kho.</p> : null}
        </div>
      </form>
      {redirecting ? <VnpayRedirectOverlay countdown={redirectCountdown} timedOut={redirectTimedOut} onRetry={retryVnpayRedirect} /> : null}
    </>
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

function VnpayRedirectOverlay({ countdown, timedOut, onRetry }: { countdown: number; timedOut: boolean; onRetry: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-navy/88 px-4 text-ivory backdrop-blur-md" role="alert" aria-live="assertive">
      <div className="w-full max-w-md overflow-hidden rounded-sm border border-white/15 bg-[#101827] shadow-premium">
        <div className="grid gap-6 p-6 text-center sm:p-8">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-cta/40 bg-cta/10">
            <div className="relative grid h-14 w-14 place-items-center rounded-full bg-cta text-navy">
              <ShieldCheck className="h-7 w-7" />
              <span className="absolute inset-0 rounded-full border-2 border-cta/70 border-t-transparent animate-spin" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-normal text-white">Đang chuyển hướng đến VNPay...</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">Quá trình này có thể mất vài giây</p>
          </div>
          <div className="grid gap-3">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-[vnpay-progress_1.35s_ease-in-out_infinite] rounded-full bg-cta" />
            </div>
            <p className="text-xs text-white/55">{timedOut ? "Nếu trình duyệt chưa mở VNPay, bạn có thể thử lại." : `Tự động chuyển hướng trong giây lát. Timeout sau ${countdown}s.`}</p>
          </div>
          {timedOut ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-cta bg-cta px-4 text-sm font-bold uppercase tracking-[.12em] text-navy transition hover:border-cta-hover hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-cta/40"
            >
              <RefreshCw className="h-4 w-4" />
              Thử mở VNPay lại
            </button>
          ) : (
            <div className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-cta">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang bảo mật phiên thanh toán
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
