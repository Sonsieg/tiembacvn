import { getAdminProducts } from "@/lib/services/product.service";

export default async function AdminInventoryPage() {
  const products = await getAdminProducts();
  const variants = products.flatMap((product) => product.variants.map((variant) => ({ product, variant })));
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">Inventory</p><h1 className="text-2xl font-semibold text-ink">Tồn kho sản phẩm</h1><p className="mt-2 text-sm text-gray-500">Với Tiembac.vn giai đoạn đầu, tồn kho có thể chỉ cần liệt kê theo biến thể để biết size nào còn hàng. Reserve stock vẫn giữ trong schema để checkout không bán quá số lượng.</p></div>
      <div className="rounded-[2rem] bg-white p-4 shadow-soft">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead><tr><th className="p-3">Sản phẩm</th><th>Biến thể</th><th>SKU</th><th>Available</th><th>Reserved</th><th>Sold</th><th>Gợi ý</th></tr></thead>
          <tbody>{variants.map(({ product, variant }) => {
            const sellable = variant.inventory.quantityAvailable - variant.inventory.quantityReserved;
            return <tr key={variant.id} className="border-t border-silver-200"><td className="p-3">{product.title}</td><td>{variant.title}</td><td>{variant.sku}</td><td>{variant.inventory.quantityAvailable}</td><td>{variant.inventory.quantityReserved}</td><td>{variant.inventory.quantitySold}</td><td>{sellable <= variant.inventory.lowStockThreshold ? "Sắp hết" : "Ổn định"}</td></tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
