import { create } from "zustand";
import api from '../lib/axios';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  imageUrl?: string;
  isVisible?: boolean;
  sortOrder?: number;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  getCategory: (id: string) => Promise<Category | null>;
  createCategory: (data: CreateCategoryDto, getToken: () => Promise<string | null>) => Promise<Category | null>;
  updateCategory: (id: string, data: UpdateCategoryDto, getToken: () => Promise<string | null>) => Promise<Category | null>;
  deleteCategory: (id: string, getToken: () => Promise<string | null>) => Promise<boolean>;
  uploadImage: (file: File, getToken: () => Promise<string | null>) => Promise<string | null>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/categories');
      // Depending on if there is a global interceptor, the data might be in res.data or res.data.data
      const categories = res.data?.data ? res.data.data : res.data;
      set({ categories: categories || [], isLoading: false });
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      const msg = error.response?.data?.message || error.message || "Failed to fetch categories";
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  getCategory: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get(`/categories/${id}`);
      const category = res.data?.data ? res.data.data : res.data;
      set({ isLoading: false });
      return category;
    } catch (error: any) {
      console.error("Error fetching category:", error);
      const msg = error.response?.data?.message || error.message || "Failed to fetch category";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return null;
    }
  },

  createCategory: async (data: CreateCategoryDto, getToken: () => Promise<string | null>) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await api.post('/categories', data, { headers });
      const newCategory = response.data?.data ? response.data.data : response.data;

      set((state) => ({
        categories: [...state.categories, newCategory].sort((a, b) => a.sortOrder - b.sortOrder),
        isLoading: false,
      }));

      toast.success("Category created successfully");
      return newCategory;
    } catch (error: any) {
      console.error("Error creating category:", error);
      const msg = error.response?.data?.message || error.message || "Failed to create category";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return null;
    }
  },

  updateCategory: async (id: string, data: UpdateCategoryDto, getToken: () => Promise<string | null>) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await api.patch(`/categories/${id}`, data, { headers });
      const updatedCategory = response.data?.data ? response.data.data : response.data;

      set((state) => ({
        categories: state.categories
          .map((cat) => (cat.id === id ? updatedCategory : cat))
          .sort((a, b) => a.sortOrder - b.sortOrder),
        isLoading: false,
      }));

      toast.success("Category updated successfully");
      return updatedCategory;
    } catch (error: any) {
      console.error("Error updating category:", error);
      const msg = error.response?.data?.message || error.message || "Failed to update category";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return null;
    }
  },

  deleteCategory: async (id: string, getToken: () => Promise<string | null>) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await api.delete(`/categories/${id}`, { headers });

      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
        isLoading: false,
      }));

      toast.success("Category deleted successfully");
      return true;
    } catch (error: unknown) {
      console.error("Error", error);
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosError.response?.data?.message || axiosError.message || "Failed action";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return false;
    }
  },

  uploadImage: async (file: File, getToken: () => Promise<string | null>) => {
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const presignedRes = await api.post('/categories/presigned-url', {
        mimeType: file.type,
      }, { headers });
      
      const { uploadUrl, publicUrl } = presignedRes.data.data ? presignedRes.data.data : presignedRes.data;

      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });

      return publicUrl;
    } catch (error: unknown) {
      console.error("Error uploading category image:", error);
      toast.error("Failed to upload category image");
      return null;
    }
  },
}));
