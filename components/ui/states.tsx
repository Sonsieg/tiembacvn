import { Gem, SearchX, Loader2 } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid place-items-center rounded-[1.25rem] border border-dashed border-line bg-pearl p-10 text-center shadow-soft">
      <SearchX className="mb-3 h-8 w-8 text-cta" />
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-muted">{description}</p>
    </div>
  );
}

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-sm border border-danger/30 bg-danger/10 p-8 text-danger">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm">{description}</p>
    </div>
  );
}

export function ProductSkeleton() {
  return <div className="h-80 animate-pulse rounded-[1.25rem] border border-line bg-gradient-to-br from-ivory-soft via-pearl to-silver-100" />;
}

export function LoadingState() {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-muted">
      <Loader2 className="h-4 w-4 animate-spin" />
      Đang tải dữ liệu
    </div>
  );
}

export function LuxuryMark() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-sm border border-line bg-cta-soft text-navy">
      <Gem className="h-4 w-4" />
    </span>
  );
}
