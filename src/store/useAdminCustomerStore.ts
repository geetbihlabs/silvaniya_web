import { create } from 'zustand';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { AdminCustomer, AdminOrder, SupportTicket } from '@/types/admin.types';

export interface CustomerProfile {
  customer: AdminCustomer;
  recentOrders: Partial<AdminOrder>[];
  recentTickets: Partial<SupportTicket>[];
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminCustomerState {
  customers: AdminCustomer[];
  selectedCustomer: CustomerProfile | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    tier: string;
    page: number;
    limit: number;
  };
  setFilters: (filters: Partial<AdminCustomerState['filters']>) => void;
  fetchCustomers: (getToken: () => Promise<string | null>) => Promise<void>;
  fetchCustomerById: (id: string, getToken: () => Promise<string | null>) => Promise<void>;
}

export const useAdminCustomerStore = create<AdminCustomerState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  meta: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    tier: 'ALL',
    page: 1,
    limit: 20,
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  fetchCustomers: async (getToken) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { search, tier, page, limit } = get().filters;

      const params: Record<string, any> = { page, limit };
      if (search) params.search = search;
      if (tier && tier !== 'ALL') params.tier = tier;

      const res = await api.get('/users', { headers, params });
      
      set({
        customers: res.data?.data || [],
        meta: res.data?.meta || null,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch customers';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  fetchCustomerById: async (id, getToken) => {
    set({ isLoading: true, error: null, selectedCustomer: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await api.get(`/users/${id}`, { headers });
      
      set({
        selectedCustomer: res.data?.data || res.data,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch customer details';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },
}));
