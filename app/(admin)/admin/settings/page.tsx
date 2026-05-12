import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Settings</p><h1 className="text-2xl font-semibold text-ink">Cài đặt cửa hàng</h1><p className="mt-2 text-sm text-gray-500">Chia theo khu vực để bật/tắt section storefront, tối ưu SEO và vận hành ecommerce.</p></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-soft">
          <h2 className="font-semibold text-ink">Storefront sections</h2>
          {["Hero", "Featured categories", "New arrivals", "Best sellers", "Gift collection", "Video review", "Journal SEO"].map((section) => <Field key={section} label={section}><Select defaultValue="active"><option value="active">Active</option><option value="hidden">Hidden</option></Select></Field>)}
        </section>
        <aside className="grid h-fit gap-4 rounded-[2rem] bg-white p-5 shadow-soft">
          <h2 className="font-semibold text-ink">Thông tin & SEO</h2>
          <Field label="Store name"><Input defaultValue="Tiembac.vn" /></Field>
          <Field label="Phone"><Input defaultValue="0909 888 925" /></Field>
          <Field label="Shipping fee"><Input defaultValue="30000" /></Field>
          <Field label="Free shipping threshold"><Input defaultValue="900000" /></Field>
          <Field label="SEO default title"><Input defaultValue="Tiembac.vn — Trang sức bạc S925 cao cấp" /></Field>
          <Field label="SEO default description"><Textarea defaultValue="Trang sức bạc S925 thanh lịch, hiện đại và được chọn lọc cho từng khoảnh khắc." /></Field>
          <Button type="button">Lưu cài đặt</Button>
        </aside>
      </div>
    </div>
  );
}
