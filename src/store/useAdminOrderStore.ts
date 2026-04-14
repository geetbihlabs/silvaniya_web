import { create } from 'zustand';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { AdminOrder, AdminOrderStatus } from '@/types/admin.types';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminOrderState {
  orders: AdminOrder[];
  selectedOrder: AdminOrder | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    page: number;
    limit: number;
  };
  setFilters: (filters: Partial<AdminOrderState['filters']>) => void;
  fetchOrders: (getToken: () => Promise<string | null>) => Promise<void>;
  fetchOrderById: (id: string, getToken: () => Promise<string | null>) => Promise<void>;
  updateOrderStatus: (
    id: string,
    status: AdminOrderStatus,
    note: string,
    getToken: () => Promise<string | null>
  ) => Promise<boolean>;
  resolveReturnRequest: (
    id: string,
    approved: boolean,
    adminNote: string,
    getToken: () => Promise<string | null>
  ) => Promise<boolean>;
  updateTracking: (
    id: string,
    tracking: { awbNumber: string; courierPartner: string; trackingUrl?: string },
    getToken: () => Promise<string | null>
  ) => Promise<boolean>;
}

export const useAdminOrderStore = create<AdminOrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  meta: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  filters: {
    search: '',
    status: 'ALL',
    page: 1,
    limit: 10,
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  fetchOrders: async (getToken) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { search, status, page, limit } = get().filters;

      const params: Record<string, any> = { page, limit };
      if (search) params.search = search;
      if (status && status !== 'ALL') params.status = status;

      const res = await api.get('/orders', { headers, params });
      
      set({
        orders: res.data?.data || [],
        meta: res.data?.meta || null,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch orders';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  fetchOrderById: async (id, getToken) => {
    set({ isLoading: true, error: null, selectedOrder: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await api.get(`/orders/${id}`, { headers });
      
      set({
        selectedOrder: res.data?.data || res.data,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch order details';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  updateOrderStatus: async (id, status, note, getToken) => {
    set({ isUpdating: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await api.patch(`/orders/${id}/status`, { status, note }, { headers });
      
      // Update selected order if it matches
      const { selectedOrder, orders } = get();
      if (selectedOrder && selectedOrder.id === id) {
        set({ selectedOrder: { ...selectedOrder, status } });
      }
      
      // Update in orders list
      set({
        orders: orders.map(order => order.id === id ? { ...order, status } : order),
        isUpdating: false
      });
      
      toast.success('Order status updated successfully');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update order status';
      set({ error: msg, isUpdating: false });
      toast.error(msg);
      return false;
    }
  },

  resolveReturnRequest: async (id, approved, adminNote, getToken) => {
    set({ isUpdating: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await api.patch(`/orders/${id}/returns/resolve`, { approved, adminNote }, { headers });
      
      await get().fetchOrderById(id, getToken); // Fresh fetch to get updated return arrays etc.
      
      set({ isUpdating: false });
      toast.success(`Return request ${approved ? 'approved' : 'rejected'} successfully`);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to resolve return request';
      set({ error: msg, isUpdating: false });
      toast.error(msg);
      return false;
    }
  },

  updateTracking: async (id, tracking, getToken) => {
    set({ isUpdating: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await api.post(`/orders/${id}/fulfilment/tracking`, tracking, { headers });

      const { selectedOrder } = get();
      if (selectedOrder && selectedOrder.id === id) {
        set({ selectedOrder: { ...selectedOrder, ...tracking } });
      }

      set({ isUpdating: false });
      toast.success('Tracking information saved successfully');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save tracking info';
      set({ error: msg, isUpdating: false });
      toast.error(msg);
      return false;
    }
  },
}));
