import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { getOrderById } from "@/lib/services/order.service";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
};

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string; payment?: string }> }) {
  const { order: orderNumber, payment } = await searchParams;
  const order = orderNumber ? await getOrderById(orderNumber) : null;
  const paymentLabel = order?.paymentStatus === "paid" || payment === "paid" ? "Đã thanh toán" : payment === "failed" ? "Thanh toán thất bại" : "Chờ thanh toán";
  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <Card className="grid place-items-center p-8 text-center md:p-12">
          <CheckCircle2 className="h-16 w-16 text-emerald-600" />
          <p className="eyebrow mt-5">Cảm ơn bạn</p>
          <h1 className="heading-lg">Đơn hàng đã được ghi nhận</h1>
          <p className="mt-4 text-gray-600">{payment === "failed" ? "Đơn hàng đã được ghi nhận nhưng giao dịch thanh toán chưa thành công. Tiembac.vn sẽ hỗ trợ bạn xác nhận lại." : "Tiembac.vn sẽ liên hệ xác nhận và chuẩn bị gói quà thật chỉn chu cho bạn."}</p>
          <div className="mt-6 grid w-full gap-3 rounded-[1.5rem] bg-pearl p-5 text-left text-sm">
            <Info label="Mã đơn hàng" value={orderNumber ?? "Đang cập nhật"} />
            <Info label="Tổng tiền" value={order ? formatCurrency(order.grandTotal) : "Xem trong email xác nhận"} />
            <Info label="Trạng thái thanh toán" value={paymentLabel} />
            <Info label="Giao đến" value={order ? `${order.address.addressLine}, ${order.address.ward}, ${order.address.district}, ${order.address.province}` : "Theo thông tin đã nhập"} />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/track-order">Tra cứu đơn hàng</ButtonLink>
            <ButtonLink href="/collections" variant="secondary">Tiếp tục mua sắm</ButtonLink>
          </div>
          {orderNumber ? <Link href={`/track-order?order=${orderNumber}`} className="mt-4 text-sm text-claret hover:text-sky-700">Theo dõi đơn {orderNumber}</Link> : null}
        </Card>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-silver-200 pb-2 last:border-b-0"><span className="text-gray-500">{label}</span><b className="text-right text-ink">{value}</b></div>;
}
