import { OrdersTable, StatCard } from "@/components/admin/admin-widgets";
import { formatCurrency } from "@/lib/utils/format";
import { getAdminDashboard } from "@/lib/services/admin.service";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(data.revenue)} hint="Mock + runtime orders" />
        <StatCard label="Đơn hôm nay" value={`${data.todayOrders}`} hint="Guest checkout" />
        <StatCard label="Đơn đang chờ" value={`${data.pendingOrders}`} hint="Cần xác nhận" />
        <StatCard label="Đã thanh toán" value={`${data.paidOrders}`} hint="Qua webhook/API" />
      </div>
      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div><h2 className="mb-3 text-lg font-semibold text-ink">Đơn hàng gần đây</h2><OrdersTable orders={data.recentOrders} /></div>
        <div className="grid gap-4">
          <div className="rounded-[2rem] bg-white p-5 shadow-soft"><h2 className="font-semibold">Cảnh báo tồn kho</h2>{data.lowStock.slice(0, 5).map(({ product, variant }) => <p key={variant.id} className="mt-3 text-sm text-gray-600">{product.title} · {variant.title}: <b>{variant.inventory.quantityAvailable - variant.inventory.quantityReserved}</b></p>)}</div>
          <div className="rounded-[2rem] bg-white p-5 shadow-soft"><h2 className="font-semibold">Biểu đồ doanh số</h2><div className="mt-4 flex h-40 items-end gap-2">{[42, 70, 52, 88, 64, 92, 76].map((h, i) => <span key={i} className="flex-1 rounded-t-xl bg-claret" style={{ height: `${h}%` }} />)}</div></div>
        </div>
      </section>
    </div>
  );
}
