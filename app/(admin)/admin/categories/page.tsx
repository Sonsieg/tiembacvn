import { getCategories } from "@/lib/services/product.service";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Categories</p><h1 className="text-2xl font-semibold text-ink">Danh mục sản phẩm</h1><p className="mt-2 text-sm text-gray-500">Danh mục được dùng khi thêm/sửa sản phẩm và hiển thị storefront `/collections/[slug]`.</p></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] bg-white p-4 shadow-soft"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr><th className="p-3">Tên</th><th>Slug</th><th>Mô tả</th><th>Active</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id} className="border-t border-silver-200"><td className="p-3">{category.name}</td><td>{category.slug}</td><td>{category.description}</td><td>{category.active ? "Active" : "Hidden"}</td></tr>)}</tbody></table></div>
        <form className="grid h-fit gap-4 rounded-[2rem] bg-white p-5 shadow-soft"><h2 className="font-semibold text-ink">Thêm / chỉnh sửa danh mục</h2><Field label="Tên danh mục"><Input placeholder="Nhẫn bạc" /></Field><Field label="Slug tự parse"><Input readOnly placeholder="nhan-bac" /></Field><Field label="Mô tả"><Textarea /></Field><Field label="Ảnh đại diện"><Input placeholder="Supabase Storage URL" /></Field><Button type="button">Lưu danh mục</Button></form>
      </div>
    </div>
  );
}
