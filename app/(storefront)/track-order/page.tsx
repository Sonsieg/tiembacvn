import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/checkout/track-order-form";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Tra cứu đơn hàng Tiembac.vn bằng mã đơn và email hoặc số điện thoại.",
};

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <section className="section">
      <div className="container-page grid gap-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Theo dõi đơn</p>
          <h1 className="heading-lg">Tra cứu đơn hàng</h1>
          <p className="mt-4 text-gray-600">Khách mua không cần tài khoản vẫn theo dõi được trạng thái đơn bằng mã đơn và email hoặc số điện thoại.</p>
        </div>
        <TrackOrderForm initialOrder={order} />
      </div>
    </section>
  );
}
