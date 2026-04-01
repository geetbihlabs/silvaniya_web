import { create } from 'zustand';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

export interface ShopProductImage {
  id: string;
  s3Url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ShopProductVariant {
  id: string;
  label: string;
  size?: string;
  purity?: string;
  stockQty: number;
  lowStockAt?: number;
  priceOverride?: number;
  sku: string;
  isActive: boolean;
}

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  category?: any;
  categoryId: string;
  metalType: string;
  basePrice: number;
  salePrice?: number;
  weightGrams: number;
  status: string;
  isFeatured: boolean;
  bisHallmark: boolean;
  averageRating: number;
  reviewCount: number;
  totalSold: number;
  stock: number;
  tags: string[];
  images: ShopProductImage[];
  variants: ShopProductVariant[];
  careInstructions?: string[];
  refundPolicy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ShopProductState {
  products: ShopProduct[];
  relatedProducts: ShopProduct[];  // separate slice — never overwrites global products
  product: ShopProduct | null;
  meta: ProductMeta;
  isLoading: boolean;
  error: string | null;
  fetchProducts: (filter?: ProductFilter) => Promise<void>;
  fetchProductById: (id: string) => Promise<ShopProduct | null>;
  fetchProductBySlug: (slug: string) => Promise<ShopProduct | null>;
  /** Fetch products by a single categoryId into the relatedProducts slice. */
  fetchRelatedProducts: (categoryId: string) => Promise<ShopProduct[]>;
}

export const useShopProductStore = create<ShopProductState>((set) => ({
  products: [],
  relatedProducts: [],
  product: null,
  meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
  isLoading: false,
  error: null,

  fetchProducts: async (filter = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/products', {
        params: { status: 'PUBLISHED', ...filter },
      });
      const data = res.data?.data ?? [];
      const meta = res.data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 1 };
      set({ products: data, meta, isLoading: false });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to load products';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null, product: null });
    try {
      const res = await api.get(`/products/${id}`);
      const product: ShopProduct = res.data?.data ?? res.data;
      set({ product, isLoading: false });
      return product;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to load product';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return null;
    }
  },

  fetchProductBySlug: async (slug) => {
    set({ isLoading: true, error: null, product: null });
    try {
      const res = await api.get(`/products/slug/${slug}`);
      const product: ShopProduct = res.data?.data ?? res.data;
      set({ product, isLoading: false });
      return product;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to load product by slug';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return null;
    }
  },

  /**
   * Fetch products belonging to a single category.
   * Stores results in `relatedProducts` — does NOT overwrite the global `products` list.
   * Returns the fetched list so callers can use it directly (e.g. for Promise.all merging).
   */
  fetchRelatedProducts: async (categoryId) => {
    try {
      const res = await api.get('/products', {
        params: { category: categoryId, status: 'PUBLISHED', limit: 8 },
      });
      const data: ShopProduct[] = res.data?.data ?? [];
      return data;
    } catch {
      return [];
    }
  },
}));
