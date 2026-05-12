import { OrdersTable } from "@/components/admin/admin-widgets";
import { getOrders } from "@/lib/services/order.service";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  const statuses = [
    ["pending", "Chờ xác nhận"],
    ["confirmed", "Đã xác nhận"],
    ["processing", "Đang xử lý"],
    ["shipped", "Đã gửi hàng"],
    ["completed", "Hoàn tất"],
    ["cancelled", "Đã hủy"],
  ];
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Orders</p><h1 className="text-2xl font-semibold">Quản lý đơn hàng</h1><p className="mt-2 text-sm text-gray-500">Có thể chuyển trạng thái đơn ngay trên danh sách. Khi nối Supabase write API, select này sẽ cập nhật `orders.order_status` và ghi timeline.</p></div>
      <div className="grid gap-3 md:grid-cols-3">
        {statuses.map(([value, label]) => <a key={value} href={`/admin/orders?status=${value}`} className="admin-panel"><b className="text-claret">{label}</b><p className="mt-2 text-sm text-gray-500">{orders.filter((order) => order.orderStatus === value).length} đơn</p></a>)}
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
