import { Gem, SearchX, Loader2 } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid place-items-center rounded-[2rem] border border-dashed border-silver-300 bg-white/70 p-10 text-center">
      <SearchX className="mb-3 h-8 w-8 text-claret" />
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>
    </div>
  );
}

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm">{description}</p>
    </div>
  );
}

export function ProductSkeleton() {
  return <div className="h-80 animate-pulse rounded-[1.5rem] bg-gradient-to-br from-silver-100 to-white" />;
}

export function LoadingState() {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-gray-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      Đang tải dữ liệu
    </div>
  );
}

export function LuxuryMark() {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-full bg-claret text-sm font-semibold text-white shadow-premium">
      <Gem className="h-5 w-5" />
    </span>
  );
}
