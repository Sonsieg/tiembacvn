import { getCoupons } from "@/lib/services/coupon.service";
import { formatCurrency } from "@/lib/utils/format";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Coupons</p><h1 className="text-2xl font-semibold text-ink">Mã giảm giá</h1><p className="mt-2 text-sm text-gray-500">Khuyến nghị mã bắt đầu bằng `TB-`. Với ecommerce trang sức, giảm theo % thường dễ truyền thông hơn; fixed/free ship vẫn giữ cho campaign đặc biệt.</p></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] bg-white p-4 shadow-soft"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr><th className="p-3">Code</th><th>Type</th><th>Value</th><th>Min order</th><th>Usage</th><th>Status</th></tr></thead><tbody>{coupons.map((coupon) => <tr key={coupon.id} className="border-t border-silver-200"><td className="p-3 text-claret font-semibold">{coupon.code}</td><td>{coupon.type}</td><td>{coupon.type === "percentage" ? `${coupon.value}%` : formatCurrency(coupon.value)}</td><td>{formatCurrency(coupon.minOrderTotal)}</td><td>{coupon.used}/{coupon.usageLimit}</td><td>{coupon.active ? "Active" : "Inactive"}</td></tr>)}</tbody></table></div>
        <form className="grid h-fit gap-4 rounded-[2rem] bg-white p-5 shadow-soft"><h2 className="font-semibold text-ink">Tạo coupon</h2><Field label="Code"><Input defaultValue="TB-" /></Field><Field label="Type"><Select><option value="percentage">Percentage (%)</option><option value="fixed_amount">Fixed amount</option><option value="free_shipping">Free shipping</option></Select></Field><Field label="Value"><Input type="number" placeholder="10" /></Field><Field label="Min order total"><Input type="number" placeholder="500000" /></Field><Field label="Trạng thái"><Select><option>active</option><option>inactive</option></Select></Field><Button type="button">Lưu coupon</Button></form>
      </div>
    </div>
  );
}
