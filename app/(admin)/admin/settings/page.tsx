import { Field, Input, Textarea } from "@/components/ui/form";
import { SettingsSaveButton, StorefrontSectionSettings } from "@/components/admin/admin-settings-form";

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Settings</p><h1 className="admin-display-title">Cài đặt cửa hàng</h1><p className="mt-2 text-sm text-slate-muted">Chia theo khu vực để bật/tắt section storefront, tối ưu SEO và vận hành ecommerce.</p></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="grid gap-5 rounded-sm border border-line bg-pearl p-5 shadow-soft">
          <div>
            <h2 className="font-semibold text-slate">Khu vực storefront</h2>
            <p className="mt-1 text-sm text-slate-muted">Bật/tắt các section chính đang xuất hiện ngoài trang bán hàng.</p>
          </div>
          <StorefrontSectionSettings />
        </section>
        <aside className="grid h-fit gap-4 rounded-sm border border-line bg-pearl p-5 shadow-soft">
          <h2 className="font-semibold text-slate">Thông tin & SEO</h2>
          <Field label="Tên cửa hàng"><Input defaultValue="Tiembac.vn" /></Field>
          <Field label="Số điện thoại"><Input defaultValue="0909 888 925" /></Field>
          <Field label="Phí giao hàng"><Input defaultValue="30000" /></Field>
          <Field label="Miễn phí vận chuyển từ"><Input defaultValue="900000" /></Field>
          <Field label="SEO title mặc định"><Input defaultValue="Tiembac.vn — Trang sức bạc S925 cao cấp" /></Field>
          <Field label="SEO description mặc định"><Textarea defaultValue="Trang sức bạc S925 thanh lịch, hiện đại và được chọn lọc cho từng khoảnh khắc." /></Field>
          <SettingsSaveButton />
        </aside>
      </div>
    </div>
  );
}
