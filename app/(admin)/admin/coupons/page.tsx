import { getCoupons } from "@/lib/services/coupon.service";
import { CouponAdminWorkspace } from "@/components/admin/coupon-admin-workspace";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  return <CouponAdminWorkspace coupons={coupons} />;
}
