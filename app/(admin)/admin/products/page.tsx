import { ButtonLink } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { ProductsTable } from "@/components/admin/admin-widgets";
import { getAdminProducts } from "@/lib/services/product.service";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(Number((await searchParams).page ?? "1"), 1);
  const pageSize = 8;
  const products = await getAdminProducts();
  const totalPages = Math.max(Math.ceil(products.length / pageSize), 1);
  const visibleProducts = products.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Catalog</p><h1 className="text-2xl font-semibold">Quản lý sản phẩm</h1></div><ButtonLink href="/admin/products/new">Tạo sản phẩm</ButtonLink></div>
      <div className="grid gap-3 rounded-[2rem] bg-white p-4 shadow-soft md:grid-cols-[1fr_180px_180px]"><Input placeholder="Tìm sản phẩm..." /><Select><option>Trạng thái</option><option>Active</option><option>Draft</option></Select><Select><option>Danh mục</option><option>Nhẫn bạc</option></Select></div>
      <ProductsTable products={visibleProducts} />
      <div className="flex items-center justify-between rounded-[2rem] bg-white p-4 shadow-soft">
        <span className="text-sm text-gray-500">Trang {page}/{totalPages} · {products.length} sản phẩm</span>
        <div className="flex gap-2">
          <a className="rounded-full border border-silver-200 px-4 py-2 text-sm text-claret" href={`/admin/products?page=${Math.max(page - 1, 1)}`}>Trước</a>
          <a className="rounded-full border border-silver-200 px-4 py-2 text-sm text-claret" href={`/admin/products?page=${Math.min(page + 1, totalPages)}`}>Sau</a>
        </div>
      </div>
    </div>
  );
}
