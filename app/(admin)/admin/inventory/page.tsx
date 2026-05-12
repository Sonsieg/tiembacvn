import { getAdminProducts } from "@/lib/services/product.service";
import { InventoryWorkspace } from "@/components/admin/inventory-workspace";

export default async function AdminInventoryPage() {
  const products = await getAdminProducts();
  return <InventoryWorkspace products={products} />;
}
