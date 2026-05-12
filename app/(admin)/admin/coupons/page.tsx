import { getCoupons } from "@/lib/services/coupon.service";
import { formatCurrency } from "@/lib/utils/format";
import { EntityManager } from "@/components/admin/entity-manager";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  return <EntityManager eyebrow="Coupons" title="Mã giảm giá" description="Thêm, sửa và xem chi tiết coupon trong modal/drawer." fields={["Code", "Type", "Value", "Min order total", "Usage limit", "Active"]} rows={coupons.map((coupon) => ({ Code: coupon.code, Type: coupon.type, Value: coupon.type === "percentage" ? `${coupon.value}%` : formatCurrency(coupon.value), "Min order total": formatCurrency(coupon.minOrderTotal), "Usage limit": `${coupon.used}/${coupon.usageLimit}`, Active: coupon.active ? "Active" : "Inactive" }))} />;
}
