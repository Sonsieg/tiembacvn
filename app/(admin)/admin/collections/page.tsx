import { getCollections } from "@/lib/services/product.service";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Collections</p><h1 className="text-2xl font-semibold text-ink">Nhóm bán hàng / bộ sưu tập</h1><p className="mt-2 text-sm text-gray-500">Collection vẫn hữu ích nếu dùng như nhóm chiến dịch: Quà tặng, Signature, Minimal. Không nên lạm dụng như danh mục; hãy dùng để gom sản phẩm theo dịp tặng hoặc landing SEO.</p></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] bg-white p-4 shadow-soft"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr><th className="p-3">Tên</th><th>Slug</th><th>Mục đích</th><th>Featured</th></tr></thead><tbody>{collections.map((collection) => <tr key={collection.id} className="border-t border-silver-200"><td className="p-3">{collection.name}</td><td>{collection.slug}</td><td>{collection.description}</td><td>{collection.featured ? "Hero/landing" : "Nhóm phụ"}</td></tr>)}</tbody></table></div>
        <form className="grid h-fit gap-4 rounded-[2rem] bg-white p-5 shadow-soft"><h2 className="font-semibold text-ink">Tạo nhóm quà / collection</h2><Field label="Tên"><Input placeholder="Quà tặng sinh nhật" /></Field><Field label="Slug"><Input readOnly placeholder="qua-tang-sinh-nhat" /></Field><Field label="Loại nhóm"><Select><option>Gift group</option><option>SEO landing</option><option>Signature</option></Select></Field><Field label="Mô tả"><Textarea /></Field><Button type="button">Lưu collection</Button></form>
      </div>
    </div>
  );
}
