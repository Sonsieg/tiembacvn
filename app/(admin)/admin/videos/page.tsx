export default function AdminVideosPage() {
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Product videos</p><h1 className="text-2xl font-semibold text-ink">Video sản phẩm</h1><p className="mt-2 text-sm text-gray-500">Màn này tạm giảm ưu tiên. Link video/review sẽ được nhập trực tiếp trong form thêm/sửa sản phẩm ở field “Link review / linkup detail”. Khi cần quản lý nhiều video mỗi sản phẩm, có thể bật lại module này.</p></div>
      <div className="rounded-[2rem] bg-white p-5 shadow-soft"><h2 className="font-semibold text-ink">Khuyến nghị</h2><p className="mt-2 text-sm text-gray-600">Giai đoạn đầu chỉ cần 1 link review chính cho product detail. Không cần một menu riêng nếu team chưa có workflow sản xuất video độc lập.</p></div>
    </div>
  );
}
