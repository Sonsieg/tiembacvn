import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Order, Product } from "@/types/commerce";

export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <Card className="p-5"><p className="text-sm text-gray-500">{label}</p><b className="mt-2 block text-2xl text-ink">{value}</b><span className="text-xs text-claret">{hint}</span></Card>;
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <Card className="overflow-x-auto p-4">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="text-gray-500"><tr><th className="p-3">Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái đơn</th><th>Thanh toán</th><th>Cập nhật</th><th>Ngày tạo</th></tr></thead>
        <tbody>
          {orders.map((order) => <tr key={order.id} className="border-t border-silver-200"><td className="p-3"><Link className="font-medium text-claret" href={`/admin/orders/${order.orderNumber}`}>{order.orderNumber}</Link></td><td>{order.customer.fullName}<br /><span className="text-gray-500">{order.customer.phone}</span></td><td>{formatCurrency(order.grandTotal)}</td><td><Badge>{order.orderStatus}</Badge></td><td><Badge>{order.paymentStatus}</Badge></td><td><select defaultValue={order.orderStatus} aria-label="Chuyển trạng thái đơn"><option value="pending">Chờ xác nhận</option><option value="confirmed">Đã xác nhận</option><option value="processing">Đang xử lý</option><option value="shipped">Đã gửi hàng</option><option value="completed">Hoàn tất</option><option value="cancelled">Đã hủy</option></select></td><td>{formatDate(order.createdAt)}</td></tr>)}
        </tbody>
      </table>
    </Card>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <Card className="overflow-x-auto p-4">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="text-gray-500"><tr><th className="p-3">Sản phẩm</th><th>SKU</th><th>Giá</th><th>Tồn khả dụng</th><th>Trạng thái</th><th>SEO</th></tr></thead>
        <tbody>
          {products.map((product) => {
            const variant = product.variants[0];
            return <tr key={product.id} className="border-t border-silver-200"><td className="flex items-center gap-3 p-3"><img src={product.images[0]} alt={product.title} className="h-12 w-12 rounded-xl object-cover" /><Link className="font-medium text-claret" href={`/admin/products/${product.id}`}>{product.title}</Link></td><td>{variant.sku}</td><td>{formatCurrency(variant.price)}</td><td>{variant.inventory.quantityAvailable - variant.inventory.quantityReserved}</td><td><Badge>{product.status}</Badge></td><td className="max-w-xs truncate">{product.seoTitle}</td></tr>;
          })}
        </tbody>
      </table>
    </Card>
  );
}
