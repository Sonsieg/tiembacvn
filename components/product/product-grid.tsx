import type { Product } from "@/types/commerce";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/states";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <EmptyState title="Chưa tìm thấy sản phẩm" description="Bạn thử đổi bộ lọc hoặc quay lại bộ sưu tập chính nhé." />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
