import { create } from 'zustand';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

export interface Discount {
  id: string;
  code: string;
  description?: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  minOrderAmount?: number | null;
  maxUses?: number | null;
  maxUsesPerUser?: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type GetTokenFn = () => Promise<string | null>;

interface DiscountAdminState {
  discounts: Discount[];
  meta: DiscountMeta;
  isLoading: boolean;
  isSubmitting: boolean;

  fetchDiscounts: (getToken: GetTokenFn, page?: number) => Promise<void>;
  createDiscount: (data: Partial<Discount>, getToken: GetTokenFn) => Promise<boolean>;
  updateDiscount: (id: string, data: Partial<Discount>, getToken: GetTokenFn) => Promise<boolean>;
  toggleDiscountStatus: (id: string, currentStatus: boolean, getToken: GetTokenFn) => Promise<void>;
  deactivateDiscount: (id: string, getToken: GetTokenFn) => Promise<void>;
  fetchDiscountById: (id: string, getToken: GetTokenFn) => Promise<Discount | null>;
}

async function authHeader(getToken: GetTokenFn) {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const useDiscountAdminStore = create<DiscountAdminState>((set, get) => ({
  discounts: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
  isLoading: false,
  isSubmitting: false,

  fetchDiscounts: async (getToken, page = 1) => {
    set({ isLoading: true });
    try {
      const headers = await authHeader(getToken);
      const res = await api.get(`/discounts?page=${page}&limit=20`, { headers });
      set({
        discounts: res.data?.data ?? [],
        meta: res.data?.meta ?? get().meta,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
      toast.error('Failed to load discounts.');
    }
  },

  fetchDiscountById: async (id, getToken) => {
    try {
      const headers = await authHeader(getToken);
      const res = await api.get(`/discounts/${id}`, { headers });
      return res.data?.data ?? res.data ?? null;
    } catch {
      return null;
    }
  },

  createDiscount: async (data, getToken) => {
    set({ isSubmitting: true });
    try {
      const headers = await authHeader(getToken);
      await api.post('/discounts', data, { headers });
      toast.success('Coupon created successfully!');
      set({ isSubmitting: false });
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to create coupon.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      set({ isSubmitting: false });
      return false;
    }
  },

  updateDiscount: async (id, data, getToken) => {
    set({ isSubmitting: true });
    try {
      const headers = await authHeader(getToken);
      await api.patch(`/discounts/${id}`, data, { headers });
      toast.success('Coupon updated successfully!');
      set({ isSubmitting: false });
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to update coupon.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      set({ isSubmitting: false });
      return false;
    }
  },

  toggleDiscountStatus: async (id, currentStatus, getToken) => {
    // Optimistic update
    set((state) => ({
      discounts: state.discounts.map((d) =>
        d.id === id ? { ...d, isActive: !currentStatus } : d,
      ),
    }));

    try {
      const headers = await authHeader(getToken);
      await api.patch(`/discounts/${id}`, { isActive: !currentStatus }, { headers });
      toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch {
      // Revert on failure
      set((state) => ({
        discounts: state.discounts.map((d) =>
          d.id === id ? { ...d, isActive: currentStatus } : d,
        ),
      }));
      toast.error('Failed to change coupon status.');
    }
  },

  deactivateDiscount: async (id, getToken) => {
    try {
      const headers = await authHeader(getToken);
      await api.delete(`/discounts/${id}`, { headers });
      set((state) => ({
        discounts: state.discounts.map((d) =>
          d.id === id ? { ...d, isActive: false } : d,
        ),
      }));
      toast.success('Coupon deactivated.');
    } catch {
      toast.error('Failed to deactivate coupon.');
    }
  },
}));
