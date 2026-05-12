"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { CartSummary } from "@/components/cart/cart-summary";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart.store";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const clearCart = useCartStore((state) => state.clearCart);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  async function submit(values: CheckoutInput) {
    setError("");
    setLoading(true);
    const payload = {
      ...values,
      couponCode,
      items: items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })),
    };
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Không thể tạo đơn hàng");
      return;
    }
    clearCart();
    router.push(`/order-success?order=${data.order.orderNumber}`);
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="grid gap-5">
        <Panel title="Thông tin liên hệ">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Họ và tên" error={form.formState.errors.customer?.fullName?.message}><Input {...form.register("customer.fullName")} /></Field>
            <Field label="Số điện thoại" error={form.formState.errors.customer?.phone?.message}><Input {...form.register("customer.phone")} /></Field>
            <Field label="Email" error={form.formState.errors.customer?.email?.message}><Input type="email" {...form.register("customer.email")} /></Field>
          </div>
        </Panel>
        <Panel title="Địa chỉ nhận hàng">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Địa chỉ" error={form.formState.errors.address?.addressLine?.message}><Input {...form.register("address.addressLine")} /></Field>
            <Field label="Phường/xã" error={form.formState.errors.address?.ward?.message}><Input {...form.register("address.ward")} /></Field>
            <Field label="Quận/huyện" error={form.formState.errors.address?.district?.message}><Input {...form.register("address.district")} /></Field>
            <Field label="Tỉnh/thành phố" error={form.formState.errors.address?.province?.message}><Input {...form.register("address.province")} /></Field>
            <Field label="Ghi chú đơn hàng"><Textarea {...form.register("address.note")} /></Field>
          </div>
        </Panel>
        <Panel title="Giao hàng & thanh toán">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-ink"><PackageCheck className="mb-2 h-5 w-5 text-sky-700" /> Giao hàng tiêu chuẩn, miễn phí nếu đạt ngưỡng.</div>
            <Field label="Phương thức thanh toán"><Select {...form.register("paymentMethod")}><option value="cod">COD</option><option value="bank_transfer">Chuyển khoản ngân hàng</option><option value="online">Thanh toán online placeholder</option></Select></Field>
          </div>
        </Panel>
        {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      </div>
      <div className="grid h-fit gap-4 lg:sticky lg:top-24">
        <CartSummary />
        <Button disabled={loading || !items.length} className="w-full" size="lg"><CreditCard className="h-4 w-4" /> {loading ? "Đang đặt hàng..." : "Đặt hàng"}</Button>
      </div>
    </form>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-[2rem] border border-silver-200 bg-white p-5 shadow-soft"><h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>{children}</section>;
}
