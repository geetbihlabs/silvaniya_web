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
  category?: Category;
  categoryId: string;
  status: ProductStatus;
  images: ProductImage[];
  variants?: ProductVariant[];
  weightGrams?: number;
  material?: string;
  purity?: string;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
  stock: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isVisible: boolean;
  sortOrder: number;
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

export type ProductStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface ProductFilter {
  categoryId?: string;
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
