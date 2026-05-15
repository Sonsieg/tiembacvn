import { OrdersTable } from "@/components/admin/admin-widgets";
import { getOrders, isRevenueOrder } from "@/lib/services/order.service";
import { orderStatusLabels } from "@/lib/utils/order-workflow";
import { formatCurrency } from "@/lib/utils/format";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  const pending = orders.filter((order) => order.orderStatus === "pending").length;
  const codPending = orders.filter((order) => order.paymentMethod === "cod" && order.orderStatus === "pending").length;
  const onlinePending = orders.filter((order) => order.paymentMethod === "online" && order.paymentStatus === "pending").length;
  const revenue = orders.filter(isRevenueOrder).reduce((sum, order) => sum + order.grandTotal, 0);
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Orders</p><h1 className="admin-display-title">Quản lý đơn hàng</h1><p className="mt-2 text-sm text-gray-500">Theo dõi trạng thái đơn, thanh toán, thông tin giao hàng và timeline xử lý.</p></div>
      <div className="grid gap-3 md:grid-cols-3">
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Tổng đơn</p><b className="mt-2 block text-2xl text-ink">{orders.length}</b></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Chờ xác nhận</p><b className="mt-2 block text-2xl text-warning">{pending}</b><span className="mt-1 block text-xs text-slate-muted">COD: {codPending} · VNPay chờ thanh toán: {onlinePending}</span></section>
        <section className="admin-panel"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-muted">Doanh thu ghi nhận</p><b className="mt-2 block text-2xl text-cta">{formatCurrency(revenue)}</b></section>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {Object.entries(orderStatusLabels).map(([value, label]) => <section key={value} className="admin-panel"><b className="text-claret">{label}</b><p className="mt-2 text-sm text-gray-500">{orders.filter((order) => order.orderStatus === value).length} đơn</p></section>)}
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
