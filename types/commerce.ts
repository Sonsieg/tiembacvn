export type ProductStatus = "active" | "inactive" | "draft" | "archived";
export type PaymentMethod = "cod" | "bank_transfer" | "online";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "completed" | "cancelled";
export type FulfillmentStatus = "unfulfilled" | "packed" | "shipped" | "delivered" | "returned";
export type VideoType = "Review" | "Đeo thử" | "Mở hộp" | "Hướng dẫn chọn size";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured?: boolean;
  active?: boolean;
};

export type ProductVariant = {
  id: string;
  productId: string;
  title: string;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  active: boolean;
  inventory: InventoryItem;
};

export type InventoryItem = {
  variantId: string;
  quantityAvailable: number;
  quantityReserved: number;
  quantitySold: number;
  lowStockThreshold: number;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  careGuide: string;
  material: string;
  weight: string;
  stone?: string;
  plating?: string;
  warrantyMonths: number;
  giftWrap: boolean;
  images: string[];
  categorySlugs: string[];
  collectionSlugs: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  tags: string[];
  status: ProductStatus;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
};

export type Review = {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
};

export type ProductVideo = {
  id: string;
  productId: string;
  youtubeUrl: string;
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  type: VideoType;
  sortOrder: number;
  featured: boolean;
  status: "active" | "hidden" | "archived";
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string[];
  publishedAt: string;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
};

export type CartItem = {
  productId: string;
  variantId: string;
  productSlug: string;
  title: string;
  variantTitle: string;
  sku: string;
  image: string;
  unitPrice: number;
  compareAtPrice?: number;
  quantity: number;
};

export type CheckoutCustomer = {
  fullName: string;
  phone: string;
  email: string;
};

export type CheckoutAddress = {
  addressLine: string;
  ward: string;
  district: string;
  province: string;
  note?: string;
};

export type OrderItemSnapshot = CartItem & {
  totalPrice: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customer: CheckoutCustomer;
  address: CheckoutAddress;
  items: OrderItemSnapshot[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  grandTotal: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  timeline: { label: string; at: string; note?: string }[];
  createdAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed_amount" | "free_shipping";
  value: number;
  minOrderTotal: number;
  usageLimit: number;
  used: number;
  active: boolean;
};
