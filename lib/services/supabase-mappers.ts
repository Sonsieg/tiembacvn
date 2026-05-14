import type { BlogPost, Category, Collection, Product, ProductVariant, Review, ProductVideo } from "@/types/commerce";

type AnyRow = Record<string, unknown>;

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function bool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function int(value: unknown, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

function rows(value: unknown): AnyRow[] {
  return Array.isArray(value) ? (value as AnyRow[]) : [];
}

function asRow(value: unknown): AnyRow | null {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as AnyRow;
  return null;
}

export function mapCategory(row: AnyRow): Category {
  return {
    id: text(row.id),
    name: text(row.name),
    slug: text(row.slug),
    description: text(row.description),
    image: text(row.image),
    active: bool(row.active, true),
  };
}

export function mapCollection(row: AnyRow): Collection {
  return {
    id: text(row.id),
    name: text(row.name),
    slug: text(row.slug),
    description: text(row.description),
    image: text(row.image),
    featured: bool(row.featured),
    active: bool(row.active, true),
  };
}

export function mapProduct(row: AnyRow): Product {
  const variants: ProductVariant[] = rows(row.product_variants).map((variant) => {
    const inventory = Array.isArray(variant.inventory_items) ? asRow(variant.inventory_items[0]) : asRow(variant.inventory_items);
    return {
      id: text(variant.id),
      productId: text(row.id),
      title: text(variant.title),
      sku: text(variant.sku),
      size: text(variant.size) || undefined,
      color: text(variant.color) || undefined,
      price: int(variant.price),
      compareAtPrice: typeof variant.compare_at_price === "number" ? variant.compare_at_price : undefined,
      costPrice: typeof variant.cost_price === "number" ? variant.cost_price : undefined,
      active: bool(variant.active, true),
      inventory: {
        variantId: text(variant.id),
        quantityAvailable: int(inventory?.quantity_available),
        quantityReserved: int(inventory?.quantity_reserved),
        quantitySold: int(inventory?.quantity_sold),
        lowStockThreshold: int(inventory?.low_stock_threshold, 4),
      },
    };
  });

  const images = rows(row.product_images)
    .sort((a, b) => int(a.sort_order) - int(b.sort_order))
    .map((image) => text(image.url))
    .filter(Boolean);

  return {
    id: text(row.id),
    title: text(row.title),
    slug: text(row.slug),
    shortDescription: text(row.short_description),
    description: text(row.description),
    careGuide: text(row.care_guide),
    material: text(row.material, "Bạc S925"),
    weight: text(row.weight),
    stone: text(row.stone) || undefined,
    plating: text(row.plating) || undefined,
    warrantyMonths: int(row.warranty_months, 6),
    giftWrap: bool(row.gift_wrap, true),
    images: images.length ? images : [text(row.og_image)].filter(Boolean),
    categorySlugs: rows(row.product_categories).map((entry) => text(asRow(entry.categories)?.slug)).filter(Boolean),
    collectionSlugs: rows(row.product_collections).map((entry) => text(asRow(entry.collections)?.slug)).filter(Boolean),
    variants,
    rating: Number(row.rating ?? 5),
    reviewCount: int(row.review_count),
    featured: bool(row.featured),
    bestSeller: bool(row.best_seller),
    newArrival: bool(row.new_arrival),
    tags: Array.isArray(row.tags) ? row.tags.filter((tag): tag is string => typeof tag === "string") : [],
    status: text(row.status, "active") as Product["status"],
    seoTitle: text(row.seo_title, text(row.title)),
    seoDescription: text(row.seo_description, text(row.short_description)),
    ogImage: text(row.og_image, images[0] ?? ""),
  };
}

export function mapReview(row: AnyRow): Review {
  return {
    id: text(row.id),
    productId: text(row.product_id),
    customerName: text(row.customer_name),
    rating: Number(row.rating),
    comment: text(row.comment),
    approved: bool(row.approved),
    createdAt: text(row.created_at),
  };
}

export function mapVideo(row: AnyRow): ProductVideo {
  return {
    id: text(row.id),
    productId: text(row.product_id),
    youtubeUrl: text(row.youtube_url),
    youtubeId: text(row.youtube_id),
    title: text(row.title),
    thumbnailUrl: text(row.thumbnail_url),
    type: text(row.type) as ProductVideo["type"],
    sortOrder: int(row.sort_order),
    featured: bool(row.featured),
    status: text(row.status, "active") as ProductVideo["status"],
  };
}

export function mapBlogPost(row: AnyRow): BlogPost {
  return {
    id: text(row.id),
    title: text(row.title),
    slug: text(row.slug),
    excerpt: text(row.excerpt),
    coverImage: text(row.cover_image),
    content: Array.isArray(row.content) ? row.content.filter((item): item is string => typeof item === "string") : [],
    publishedAt: text(row.published_at),
    status: text(row.status, "published") as BlogPost["status"],
    seoTitle: text(row.seo_title, text(row.title)),
    seoDescription: text(row.seo_description, text(row.excerpt)),
  };
}
