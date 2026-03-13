import { create } from 'zustand';
import api from '../lib/axios';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductState {
  isSubmitting: boolean;
  isLoading: boolean;
  products: Record<string, unknown>[];
  meta: PaginationMeta;
  error: string | null;
  createProduct: (data: Record<string, unknown>, getToken: () => Promise<string | null>, images: File[]) => Promise<boolean>;
  updateProduct: (id: string, data: Record<string, unknown>, getToken: () => Promise<string | null>, images?: File[]) => Promise<boolean>;
  fetchProducts: (getToken: () => Promise<string | null>, filter?: Record<string, unknown>) => Promise<void>;
  fetchProductById: (id: string, getToken: () => Promise<string | null>) => Promise<Record<string, unknown> | null>;
  deleteProductImage: (productId: string, mediaId: string, getToken: () => Promise<string | null>) => Promise<boolean>;
  deleteProduct: (id: string, getToken: () => Promise<string | null>) => Promise<boolean>;
}

export const useProductStore = create<ProductState>((set) => ({
  isSubmitting: false,
  isLoading: false,
  products: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
  error: null,
  
  createProduct: async (data, getToken, images) => {
    set({ isSubmitting: true, error: null });
    
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Create product using centralized axios instance
      const res = await api.post('/products', data, { headers });
      const newProduct = res.data.data;

      // 2. Upload images process
      if (images && images.length > 0) {
        toast.loading("Uploading images...", { id: "imageUpload" });
        try {
          for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const isPrimary = i === 0;

            // Get presigned URL using standard api instance
            const presignedRes = await api.post(`/products/${newProduct.id}/media/presigned-url`, {
              filename: file.name,
              contentType: file.type,
            }, { headers });
            
            const { uploadUrl, key } = presignedRes.data.data;

            // Direct upload to S3/R2 with standard axios
            await axios.put(uploadUrl, file, {
              headers: { 'Content-Type': file.type },
            });

            // Confirm upload
            await api.post(`/products/${newProduct.id}/media`, {
              s3Key: key,
              isPrimary,
              altText: `${newProduct.name} - Image ${i + 1}`,
              sortOrder: i,
            }, { headers });
          }
          toast.success("Images uploaded successfully!", { id: "imageUpload" });
        } catch (imgError) {
          console.error("Image upload failed:", imgError);
          toast.error("Product created, but some images failed to upload.", { id: "imageUpload" });
        }
      }
      
      set({ isSubmitting: false });
      return true;
    } catch (error: unknown) {
      console.error('Error creating product:', error);
      const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
      const msg = axiosError.response?.data?.message || axiosError.message || 'Failed to create product';
      set({ error: msg, isSubmitting: false });
      toast.error(msg);
      return false;
    }
  },

  fetchProducts: async (getToken, filter = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get('/products', { 
        headers,
        params: filter
      });
      
      // Backend returns PaginatedResponse: { data: Product[], meta: ... }
      set({ products: res.data.data || [], meta: res.data.meta || { page: 1, limit: 20, total: 0, totalPages: 1 }, isLoading: false });
    } catch (error: unknown) {
      console.error('Error fetching products:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const msg = axiosError.response?.data?.message || 'Failed to fetch products';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  fetchProductById: async (id, getToken) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get(`/products/${id}`, { headers });
      set({ isLoading: false });
      return res.data.data;
    } catch (error: unknown) {
      console.error('Error fetching product details:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const msg = axiosError.response?.data?.message || 'Failed to fetch product details';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return null;
    }
  },

  deleteProductImage: async (productId, mediaId, getToken) => {
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.delete(`/products/${productId}/media/${mediaId}`, { headers });
      return true;
    } catch (error: unknown) {
      console.error('Error deleting product image:', error);
      const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
      const msg = axiosError.response?.data?.message || axiosError.message || 'Failed to delete image';
      toast.error(msg);
      return false;
    }
  },

  deleteProduct: async (id, getToken) => {
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.delete(`/products/${id}`, { headers });
      // Remove from local state immediately for snappy UX
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        meta: { ...state.meta, total: Math.max(0, state.meta.total - 1) },
      }));
      toast.success('Product archived successfully');
      return true;
    } catch (error: unknown) {
      console.error('Error deleting product:', error);
      const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
      const msg = axiosError.response?.data?.message || axiosError.message || 'Failed to archive product';
      toast.error(msg);
      return false;
    }
  },


  updateProduct: async (id, data, getToken, images) => {
    set({ isSubmitting: true, error: null });
    
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Update product detail
      await api.patch(`/products/${id}`, data, { headers });

      // 2. Upload new images if provided
      // (Assuming the backend handles existing vs new or we simply append)
      if (images && images.length > 0) {
        toast.loading("Uploading images...", { id: "imageUpload" });
        try {
          for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const isPrimary = i === 0; // Or better logic to figure out if it's the primary if appending

            const presignedRes = await api.post(`/products/${id}/media/presigned-url`, {
              filename: file.name,
              contentType: file.type,
            }, { headers });
            
            const { uploadUrl, key } = presignedRes.data.data;

            await axios.put(uploadUrl, file, {
              headers: { 'Content-Type': file.type },
            });

            await api.post(`/products/${id}/media`, {
              s3Key: key,
              isPrimary,
              altText: `${data.name || 'Product'} - Image ${i + 1}`,
              sortOrder: i,
            }, { headers });
          }
          toast.success("Images uploaded successfully!", { id: "imageUpload" });
        } catch (imgError) {
          console.error("Image upload failed:", imgError);
          toast.error("Product updated, but some images failed to upload.", { id: "imageUpload" });
        }
      }
      
      set({ isSubmitting: false });
      toast.success("Product updated successfully!");
      return true;
    } catch (error: unknown) {
      console.error('Error updating product:', error);
      const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
      const msg = axiosError.response?.data?.message || axiosError.message || 'Failed to update product';
      set({ error: msg, isSubmitting: false });
      toast.error(msg);
      return false;
    }
  }
}));
