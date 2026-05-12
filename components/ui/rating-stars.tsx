import { Star } from "lucide-react";

export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
      <span className="inline-flex text-amber-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </span>
      <span>{rating.toFixed(1)}{count ? ` (${count})` : ""}</span>
    </span>
  );
}
