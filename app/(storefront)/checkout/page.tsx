import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Thanh toán",
  description: "Guest checkout tại Tiembac.vn. Không cần đăng nhập để đặt trang sức bạc S925.",
};

export default function CheckoutPage() {
  return (
    <section className="section">
      <div className="container-page grid gap-8">
        <div>
          <p className="eyebrow">Guest checkout</p>
          <h1 className="heading-lg">Thông tin đặt hàng</h1>
          <p className="mt-4 text-gray-600">Bạn không cần đăng nhập. Tiembac.vn sẽ tính lại giá, mã giảm giá và tồn kho trên server trước khi tạo đơn.</p>
        </div>
        <CheckoutForm />
      </div>
    </section>
  );
}
