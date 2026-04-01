import { create } from 'zustand';
import api from '@/lib/axios';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export interface Testimonial {
  id: string;
  name: string;
  city?: string | null;
  text: string;
  avatarUrl?: string | null;
  rating: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type GetTokenFn = () => Promise<string | null>;

interface TestimonialAdminState {
  testimonials: Testimonial[];
  meta: PaginationMeta;
  isLoading: boolean;
  isSubmitting: boolean;

  fetchTestimonials: (getToken: GetTokenFn, page?: number, limit?: number) => Promise<void>;
  fetchTestimonialById: (id: string, getToken: GetTokenFn) => Promise<Testimonial | null>;
  createTestimonial: (data: Partial<Testimonial>, getToken: GetTokenFn) => Promise<boolean>;
  updateTestimonial: (id: string, data: Partial<Testimonial>, getToken: GetTokenFn) => Promise<boolean>;
  toggleStatus: (id: string, currentStatus: boolean, getToken: GetTokenFn) => Promise<void>;
  deleteTestimonial: (id: string, getToken: GetTokenFn) => Promise<void>;
  uploadImage: (file: File, getToken: GetTokenFn) => Promise<string | null>;
}

const authHeader = async (getToken: GetTokenFn) => ({
  Authorization: `Bearer ${await getToken()}`,
});

export const useTestimonialAdminStore = create<TestimonialAdminState>((set, get) => ({
  testimonials: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
  isLoading: false,
  isSubmitting: false,

  fetchTestimonials: async (getToken, page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const headers = await authHeader(getToken);
      const res = await api.get(`/admin/testimonials?page=${page}&limit=${limit}`, { headers });
      // TransformInterceptor wraps as: { success: true, data: { data: [], total: 0 } }
      const payload = res.data?.data ?? res.data;
      const testimonials: Testimonial[] = payload?.data ?? (Array.isArray(payload) ? payload : []);
      const total: number = payload?.total ?? 0;
      set({
        testimonials,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
      });
    } catch (err: any) {
      // Log the real error so it's visible in browser DevTools → Console
      console.error('[Testimonials] fetchTestimonials failed:', err?.response?.status, err?.response?.data ?? err?.message);
      toast.error('Failed to load testimonials');
      set({ testimonials: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTestimonialById: async (id, getToken) => {
    try {
      const headers = await authHeader(getToken);
      const res = await api.get(`/admin/testimonials/${id}`, { headers });
      // Unwrap TransformInterceptor: { success, data: Testimonial }
      return res.data?.data ?? res.data;
    } catch (err: any) {
      console.error('[Testimonials] fetchTestimonialById failed:', err?.response?.status, err?.response?.data ?? err?.message);
      toast.error('Failed to load testimonial');
      return null;
    }
  },

  createTestimonial: async (data, getToken) => {
    set({ isSubmitting: true });
    try {
      if (!data.sortOrder) data.sortOrder = 0;
      if (!data.rating) data.rating = 5;

      const headers = await authHeader(getToken);
      await api.post('/admin/testimonials', data, { headers });
      toast.success('Testimonial created successfully');
      set({ isSubmitting: false });
      // Refresh the list so the new entry appears immediately on navigation back
      await get().fetchTestimonials(getToken);
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create testimonial';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      set({ isSubmitting: false });
      return false;
    }
  },

  updateTestimonial: async (id, data, getToken) => {
    set({ isSubmitting: true });
    try {
      const headers = await authHeader(getToken);
      await api.patch(`/admin/testimonials/${id}`, data, { headers });
      toast.success('Testimonial updated successfully');
      set({ isSubmitting: false });
      // Refresh the list so edits are reflected immediately on navigation back
      await get().fetchTestimonials(getToken);
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update testimonial';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      set({ isSubmitting: false });
      return false;
    }
  },

  toggleStatus: async (id, currentStatus, getToken) => {
    set((state) => ({
      testimonials: state.testimonials.map((t) =>
        t.id === id ? { ...t, isActive: !currentStatus } : t
      ),
    }));

    try {
      const headers = await authHeader(getToken);
      await api.patch(`/admin/testimonials/${id}`, { isActive: !currentStatus }, { headers });
      toast.success(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch {
      set((state) => ({
        testimonials: state.testimonials.map((t) =>
          t.id === id ? { ...t, isActive: currentStatus } : t
        ),
      }));
      toast.error('Failed to change status');
    }
  },

  deleteTestimonial: async (id, getToken) => {
    try {
      const headers = await authHeader(getToken);
      await api.delete(`/admin/testimonials/${id}`, { headers });
      set((state) => ({
        testimonials: state.testimonials.filter((t) => t.id !== id),
        meta: { ...state.meta, total: state.meta.total - 1 },
      }));
      toast.success('Testimonial deleted completely');
    } catch {
      toast.error('Failed to delete testimonial');
    }
  },

  uploadImage: async (file, getToken) => {
    try {
      const headers = await authHeader(getToken);
      const presignedRes = await api.post('/admin/testimonials/presigned-url', {
        mimeType: file.type,
      }, { headers });
      
      // Unwrap TransformInterceptor: { success, data: { uploadUrl, publicUrl, key } }
      const payload = presignedRes.data?.data ?? presignedRes.data;
      const { uploadUrl, publicUrl } = payload;

      if (!uploadUrl || !publicUrl) {
        throw new Error("Missing uploadUrl or publicUrl in response");
      }

      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });

      return publicUrl;
    } catch (err: any) {
      console.error('[Testimonials] uploadImage failed:', err?.response?.status, err?.response?.data ?? err?.message);
      toast.error('Failed to upload image');
      return null;
    }
  },
}));
