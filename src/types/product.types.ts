// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number;
  category: ProductCategory;
  status: ProductStatus;
  images: ProductImage[];
  variants?: ProductVariant[];
  weightGrams?: number;
  material?: string;
  purity?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
  stock: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size?: string;
  purity?: string;
  stockQty: number;
  priceOverride?: number;
}

export type ProductCategory =
  | "jewellery"
  | "mangalsutras"
  | "rings"
  | "necklaces"
  | "bangles"
  | "earrings"
  | "pendants"
  | "anklets"
  | "toe-rings"
  | "nose-pins"
  | "silver-coins"
  | "bracelets"
  | "new-arrivals"
  | "best-sellers"
  | "wedding-special"
  | "gifting-guide";

export type ProductStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  occasion?: string;
  discount?: string;
  sortBy?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
  page?: number;
  limit?: number;
  search?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  body: string;
  createdAt: string;
}
