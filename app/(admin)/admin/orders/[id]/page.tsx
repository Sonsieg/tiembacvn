import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { OrderStatusEditor } from "@/components/admin/order-status-editor";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { getOrderById } from "@/lib/services/order.service";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const order = await getOrderById((await params).id);
  if (!order) notFound();
  return (
    <div className="grid gap-5">
      <div>
        <p className="eyebrow">Order detail</p>
        <h1 className="admin-display-title">{order.orderNumber}</h1>
        <p className="mt-2 text-sm text-slate-muted">{formatDate(order.createdAt)} · {order.customer.fullName} · {order.customer.phone}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-5">
          <section className="admin-panel">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-ink">Thông tin khách hàng</h2>
                <p className="mt-2 font-medium text-slate">{order.customer.fullName}</p>
                <p className="text-sm text-slate-muted">{order.customer.phone} · {order.customer.email}</p>
                <p className="mt-2 text-sm text-slate-muted">{order.address.addressLine}, {order.address.ward}, {order.address.district}, {order.address.province}</p>
                {order.address.note ? <p className="mt-2 rounded-sm border border-warning/25 bg-warning/10 p-3 text-sm text-warning">{order.address.note}</p> : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{order.orderStatus}</Badge>
                <Badge>{order.paymentStatus}</Badge>
                <Badge>{order.fulfillmentStatus}</Badge>
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <h2 className="font-semibold text-ink">Sản phẩm đã chốt giá</h2>
            <div className="mt-4 grid gap-3">
              {order.items.map((item) => (
                <div key={item.variantId} className="flex items-center justify-between gap-3 rounded-sm border border-line bg-pearl p-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="h-14 w-14 rounded-sm object-cover" />
                    <div>
                      <b className="text-ink">{item.title}</b>
                      <p className="text-sm text-slate-muted">{item.sku} · {item.variantTitle} · x{item.quantity}</p>
                    </div>
                  </div>
                  <b className="shrink-0 text-cta">{formatCurrency(item.totalPrice)}</b>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><span>Tạm tính</span><b>{formatCurrency(order.subtotal)}</b></div>
              <div className="flex justify-between"><span>Giảm giá</span><b>{formatCurrency(order.discountTotal)}</b></div>
              <div className="flex justify-between"><span>Phí vận chuyển</span><b>{formatCurrency(order.shippingFee)}</b></div>
              <div className="flex justify-between text-base"><span>Tổng cộng</span><b className="text-cta">{formatCurrency(order.grandTotal)}</b></div>
            </div>
          </section>

          <OrderStatusEditor order={order} />
        </div>

        <aside className="admin-panel h-fit">
          <h2 className="font-semibold text-ink">Timeline</h2>
          <div className="mt-4 grid gap-3">
            {order.timeline.map((item) => (
              <div key={`${item.at}-${item.label}`} className="border-l-2 border-cta pl-4">
                <b className="text-sm text-ink">{item.label}</b>
                <p className="text-xs text-slate-muted">{formatDate(item.at)}</p>
                {item.note ? <p className="mt-1 text-sm text-slate-muted">{item.note}</p> : null}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
