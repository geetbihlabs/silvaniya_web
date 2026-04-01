import { create } from 'zustand';
import api from '@/lib/axios';

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

interface TestimonialState {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
  fetchActiveTestimonials: () => Promise<void>;
}

export const useTestimonialStore = create<TestimonialState>((set) => ({
  testimonials: [],
  isLoading: false,
  error: null,

  fetchActiveTestimonials: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/testimonials');
      // TransformInterceptor wraps the response as:
      // { success: true, data: { data: Testimonial[], total: number } }
      const wrapped = res.data?.data;
      const data: Testimonial[] = wrapped?.data ?? (Array.isArray(wrapped) ? wrapped : []);
      set({ testimonials: data });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Failed to fetch testimonials' });
      console.error('Failed to fetch testimonials:', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));

