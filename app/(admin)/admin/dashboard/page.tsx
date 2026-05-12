import { OrdersTable, StatCard } from "@/components/admin/admin-widgets";
import { formatCurrency } from "@/lib/utils/format";
import { getAdminDashboard } from "@/lib/services/admin.service";
import { AlertTriangle, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();
  return (
    <div className="grid gap-8 p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-charcoal tracking-tight">Tổng quan</h1>
        <p className="text-taupe mt-1 text-sm">Tình hình hoạt động của Tiembac.vn hôm nay.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(data.revenue)} hint="Mock + runtime orders" />
        <StatCard label="Đơn hôm nay" value={`${data.todayOrders}`} hint="Guest checkout" />
        <StatCard label="Đơn đang chờ" value={`${data.pendingOrders}`} hint="Cần xác nhận" />
        <StatCard label="Đã thanh toán" value={`${data.paidOrders}`} hint="Qua webhook/API" />
      </div>

      {/* Main Content Sections */}
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Bảng đơn hàng */}
        <div className="rounded-2xl border border-platinum/40 bg-white shadow-soft overflow-hidden flex flex-col">
          <div className="p-6 border-b border-platinum/30">
            <h2 className="text-lg font-medium text-charcoal">Đơn hàng gần đây</h2>
          </div>
          <div className="p-0 overflow-x-auto">
            <OrdersTable orders={data.recentOrders} />
          </div>
        </div>

        {/* Cột phải: Cảnh báo & Biểu đồ */}
        <div className="grid gap-6">
          <div className="rounded-2xl border border-platinum/40 bg-white p-6 shadow-soft">
            <h2 className="font-medium text-charcoal flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Cảnh báo tồn kho
            </h2>
            <div className="space-y-3">
              {data.lowStock.slice(0, 5).map(({ product, variant }) => (
                <div key={variant.id} className="p-3.5 rounded-xl border border-platinum/50 bg-pearl/40 flex justify-between items-center">
                  <div className="flex flex-col"><span className="text-sm font-medium text-charcoal truncate">{product.title}</span><span className="text-xs text-taupe mt-0.5">{variant.title}</span></div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-700 whitespace-nowrap ml-2">Còn {variant.inventory.quantityAvailable - variant.inventory.quantityReserved}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-platinum/40 bg-white p-6 shadow-soft">
            <h2 className="font-medium text-charcoal flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-champagne" /> Biểu đồ doanh số
            </h2>
            <div className="mt-4 flex h-40 items-end gap-2">
              {[42, 70, 52, 88, 64, 92, 76].map((h, i) => (
                <span key={i} className="flex-1 rounded-t-md bg-champagne/80 hover:bg-champagne transition-colors" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
