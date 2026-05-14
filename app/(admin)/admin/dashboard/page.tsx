import { StatCard } from "@/components/admin/admin-widgets";
import { formatCurrency } from "@/lib/utils/format";
import { getAdminDashboard } from "@/lib/services/admin.service";
import { AlertTriangle } from "lucide-react";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();
  return (
    <div className="mx-auto grid max-w-7xl gap-8 p-6 md:p-8">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1 className="admin-display-title">Tổng quan vận hành</h1>
        <p className="mt-2 text-sm text-slate-muted">Tình hình hoạt động của Tiembac.vn hôm nay.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Doanh thu hôm nay" value={formatCurrency(data.revenue)} hint="Tổng đơn hiện có" />
        <StatCard label="Đơn đang chờ" value={`${data.pendingOrders}`} hint="Cần xác nhận" />
        <StatCard label="Đơn cần đóng gói" value={`${data.todayOrders}`} hint="Đang chuẩn bị" />
        <StatCard label="Đã thanh toán" value={`${data.paidOrders}`} hint="Webhook/API" />
      </div>

      <section className="rounded-sm border border-line bg-pearl p-6 shadow-soft">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate">
          <AlertTriangle className="h-5 w-5 text-warning" /> Cảnh báo tồn kho
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.lowStock.slice(0, 6).map(({ product, variant }) => (
            <div key={variant.id} className="flex items-center justify-between rounded-sm border border-line bg-ivory-soft p-3.5">
              <div className="flex min-w-0 flex-col"><span className="truncate text-sm font-medium text-slate">{product.title}</span><span className="mt-0.5 text-xs text-slate-muted">{variant.title}</span></div>
              <span className="ml-2 whitespace-nowrap rounded-sm bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">Còn {variant.inventory.quantityAvailable - variant.inventory.quantityReserved}</span>
            </div>
          ))}
          {!data.lowStock.length ? <p className="text-sm text-slate-muted">Không có sản phẩm sắp hết hàng.</p> : null}
        </div>
      </section>
    </div>
  );
}
