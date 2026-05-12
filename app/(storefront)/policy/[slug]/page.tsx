import type { Metadata } from "next";
import { notFound } from "next/navigation";

const policies: Record<string, { title: string; body: string[] }> = {
  "chinh-sach-van-chuyen": { title: "Chính sách vận chuyển", body: ["Tiembac.vn giao hàng toàn quốc qua đối tác vận chuyển uy tín.", "Miễn phí vận chuyển cho đơn từ 900.000đ. Đơn dưới ngưỡng áp dụng phí tiêu chuẩn 30.000đ.", "Thời gian giao hàng dự kiến 1-4 ngày làm việc tùy khu vực."] },
  "chinh-sach-doi-tra": { title: "Chính sách đổi trả", body: ["Hỗ trợ đổi size với sản phẩm còn nguyên tem, hộp và chưa qua sử dụng sai hướng dẫn.", "Vui lòng liên hệ trong 7 ngày kể từ khi nhận hàng để được tư vấn.", "Sản phẩm đặt riêng hoặc khắc tên không áp dụng đổi trả trừ lỗi sản xuất."] },
  "chinh-sach-bao-hanh": { title: "Chính sách bảo hành", body: ["Bảo hành 6-12 tháng tùy sản phẩm cho lỗi sản xuất.", "Hỗ trợ làm sáng bạc theo tình trạng thực tế.", "Không bảo hành rơi vỡ, biến dạng do va đập hoặc tiếp xúc hóa chất mạnh."] },
  "huong-dan-chon-size": { title: "Hướng dẫn chọn size", body: ["Dùng giấy quấn quanh ngón tay, đánh dấu điểm giao và đo chiều dài bằng milimet.", "Đo vào cuối ngày để có kết quả ổn định hơn.", "Nếu phân vân giữa hai size, hãy chọn size lớn hơn hoặc nhắn Tiembac.vn để được tư vấn."] },
  "chinh-sach-bao-mat": { title: "Chính sách bảo mật", body: ["Thông tin khách hàng chỉ dùng cho xử lý đơn hàng, chăm sóc khách hàng và thông báo liên quan.", "Tiembac.vn không bán dữ liệu cá nhân cho bên thứ ba.", "Thanh toán online sẽ được xử lý qua cổng thanh toán bảo mật khi kích hoạt."] },
  "dieu-khoan-su-dung": { title: "Điều khoản sử dụng", body: ["Khi đặt hàng, khách xác nhận thông tin cung cấp là chính xác.", "Giá và tồn kho có thể thay đổi, hệ thống sẽ xác nhận lại tại thời điểm checkout.", "Tiembac.vn có quyền từ chối đơn hàng có dấu hiệu gian lận hoặc thông tin không hợp lệ."] },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const policy = policies[(await params).slug];
  return { title: policy?.title ?? "Chính sách" };
}

export default async function PolicyPage({ params }: Props) {
  const policy = policies[(await params).slug];
  if (!policy) notFound();
  return (
    <section className="section">
      <div className="container-page max-w-3xl rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="eyebrow">Tiembac.vn</p>
        <h1 className="heading-lg">{policy.title}</h1>
        <div className="mt-8 grid gap-4 text-gray-700">
          {policy.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}
