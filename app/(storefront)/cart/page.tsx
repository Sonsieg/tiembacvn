import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Giỏ hàng",
};

export default function CartPage() {
  return (
    <section className="section">
      <div className="container-page max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-soft">
        <p className="eyebrow">Giỏ hàng</p>
        <h1 className="heading-lg">Giỏ hàng mở dạng drawer</h1>
        <p className="mt-4 text-gray-600">Bạn có thể bấm biểu tượng giỏ hàng ở header để xem sản phẩm, cập nhật số lượng và nhập mã giảm giá.</p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/collections">Tiếp tục mua sắm</ButtonLink>
          <ButtonLink href="/checkout" variant="secondary">Thanh toán</ButtonLink>
        </div>
      </div>
    </section>
  );
}
