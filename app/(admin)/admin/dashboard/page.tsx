import { OrdersTable, StatCard } from "@/components/admin/admin-widgets";
import { formatCurrency } from "@/lib/utils/format";
import { getAdminDashboard } from "@/lib/services/admin.service";
import { AlertTriangle, TrendingUp } from "lucide-react";

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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sản phẩm sắp hết hàng" value={`${data.lowStock.length}`} hint="Cần nhập thêm" />
        <StatCard label="Review chờ duyệt" value="0" hint="Mock dashboard" />
        <StatCard label="Video đang active" value="2" hint="Video review" />
        <StatCard label="Thanh toán đang chờ" value={`${data.todayOrders - data.paidOrders}`} hint="COD/chuyển khoản" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="flex flex-col overflow-visible rounded-sm border border-line bg-pearl shadow-soft">
          <div className="border-b border-line p-6">
            <h2 className="text-lg font-semibold text-slate">Đơn hàng gần đây</h2>
            <p className="mt-1 text-sm text-slate-muted">Tìm kiếm, lọc và cập nhật nhanh trạng thái đơn.</p>
          </div>
          <OrdersTable orders={data.recentOrders} />
        </div>

        <div className="grid gap-6">
          <div className="rounded-sm border border-line bg-pearl p-6 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate">
              <AlertTriangle className="h-5 w-5 text-warning" /> Cảnh báo tồn kho
            </h2>
            <div className="space-y-3">
              {data.lowStock.slice(0, 5).map(({ product, variant }) => (
                <div key={variant.id} className="flex items-center justify-between rounded-sm border border-line bg-ivory-soft p-3.5">
                  <div className="flex min-w-0 flex-col"><span className="truncate text-sm font-medium text-slate">{product.title}</span><span className="mt-0.5 text-xs text-slate-muted">{variant.title}</span></div>
                  <span className="ml-2 whitespace-nowrap rounded-sm bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">Còn {variant.inventory.quantityAvailable - variant.inventory.quantityReserved}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-line bg-pearl p-6 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate">
              <TrendingUp className="h-5 w-5 text-cta" /> Biểu đồ doanh số
            </h2>
            <div className="mt-4 flex h-40 items-end gap-2">
              {[42, 70, 52, 88, 64, 92, 76].map((h, i) => (
                <span key={i} className="flex-1 rounded-t-md bg-cta/70 transition-colors hover:bg-cta" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
