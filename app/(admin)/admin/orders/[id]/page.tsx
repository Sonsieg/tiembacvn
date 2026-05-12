import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { getOrderById } from "@/lib/services/order.service";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const order = await getOrderById((await params).id);
  if (!order) notFound();
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Order detail</p><h1 className="text-2xl font-semibold">{order.orderNumber}</h1></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card className="p-5"><h2 className="font-semibold">Items snapshot</h2><div className="mt-4 grid gap-3">{order.items.map((item) => <div key={item.variantId} className="flex gap-3 rounded-2xl bg-pearl p-3"><img src={item.image} alt={item.title} className="h-14 w-14 rounded-xl object-cover" /><div className="flex-1"><b>{item.title}</b><p className="text-sm text-gray-500">{item.sku} · {item.variantTitle}</p></div><b>{formatCurrency(item.totalPrice)}</b></div>)}</div></Card>
        <Card className="p-5"><h2 className="font-semibold">Trạng thái</h2><div className="mt-4 grid gap-2 text-sm"><Badge>{order.orderStatus}</Badge><Badge>{order.paymentStatus}</Badge><Badge>{order.fulfillmentStatus}</Badge><p>{order.customer.fullName} · {order.customer.phone}</p><p>{order.address.addressLine}, {order.address.province}</p>{order.timeline.map((item) => <p key={item.at}>{item.label} · {formatDate(item.at)}</p>)}</div></Card>
      </div>
    </div>
  );
}
