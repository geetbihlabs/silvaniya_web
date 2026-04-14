import { create } from 'zustand';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { AdminOrder } from '@/types/admin.types';

// Types matching our backend DTOs
interface RevenueTrendPoint {
  date: string;
  amount: number;
}

interface OrderDistribution {
  PENDING_PAYMENT: number;
  PAYMENT_CONFIRMED: number;
  PROCESSING: number;
  QUALITY_CHECK: number;
  SHIPPED: number;
  OUT_FOR_DELIVERY: number;
  DELIVERED: number;
  RETURN_REQUESTED: number;
  RETURN_APPROVED: number;
  RETURN_REJECTED: number;
  RETURNED: number;
  REFUNDED: number;
  CANCELLED: number;
}

interface TopProduct {
  productId: string;
  name: string;
  salesCount: number;
  revenue: number;
}

interface CustomerMetrics {
  newCustomers: number;
  returningRate: number;
}

interface GeographicDataPoint {
  region: string;
  sales: number;
}

interface DashboardKpis {
  totalRevenue: string;
  totalOrders: number;
  totalCustomers: number;
  openTickets: number;
  pendingReviews: number;
  lowStockProducts: number;
}

interface EnhancedDashboardData {
  kpis: DashboardKpis;
  revenueTrend: RevenueTrendPoint[];
  orderDistribution: OrderDistribution;
  topProducts: TopProduct[];
  customerMetrics: CustomerMetrics;
  conversionRate: number;
  geographicData: GeographicDataPoint[];
}

interface QuickStats {
  pendingOrders: number;
  openTickets: number;
  lowStockItems: number;
  pendingReviews: number;
}

interface DashboardOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface DashboardState {
  // Main dashboard data
  dashboardData: EnhancedDashboardData | null;
  recentOrders: DashboardOrder[];
  quickStats: QuickStats | null;
  
  // Loading states
  isLoading: boolean;
  isOrdersLoading: boolean;
  isQuickStatsLoading: boolean;
  
  // Errors
  error: string | null;
  ordersError: string | null;
  quickStatsError: string | null;
  
  // Actions
  fetchDashboardData: (getToken: () => Promise<string | null>) => Promise<void>;
  fetchRecentOrders: (getToken: () => Promise<string | null>) => Promise<void>;
  fetchQuickStats: (getToken: () => Promise<string | null>) => Promise<void>;
  refreshAll: (getToken: () => Promise<string | null>) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  dashboardData: null,
  recentOrders: [],
  quickStats: null,
  isLoading: false,
  isOrdersLoading: false,
  isQuickStatsLoading: false,
  error: null,
  ordersError: null,
  quickStatsError: null,

  // Fetch main dashboard data
  fetchDashboardData: async (getToken) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get('/analytics/dashboard/enhanced', { headers });
      set({ 
        dashboardData: response.data.data,
        isLoading: false 
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch dashboard data';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  // Fetch recent orders
  fetchRecentOrders: async (getToken) => {
    set({ isOrdersLoading: true, ordersError: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get('/orders', {
        headers,
        params: { page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }
      });
      set({ 
        recentOrders: response.data.data || [],
        isOrdersLoading: false 
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch recent orders';
      set({ ordersError: msg, isOrdersLoading: false });
      // Fallback to mock data on error
      const mockOrders = [
        {
          id: "ord_1",
          orderNumber: "ORD-001",
          status: "PROCESSING",
          totalAmount: 12999,
          createdAt: new Date().toISOString(),
          user: {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com"
          }
        },
        {
          id: "ord_2", 
          orderNumber: "ORD-002",
          status: "SHIPPED",
          totalAmount: 8499,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          user: {
            firstName: "Jane",
            lastName: "Smith", 
            email: "jane@example.com"
          }
        }
      ];
      set({ recentOrders: mockOrders });
    }
  },

  // Fetch quick stats
  fetchQuickStats: async (getToken) => {
    set({ isQuickStatsLoading: true, quickStatsError: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get('/analytics/dashboard/quick-stats', { headers });
      set({ 
        quickStats: response.data.data,
        isQuickStatsLoading: false 
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch quick stats';
      set({ quickStatsError: msg, isQuickStatsLoading: false });
      toast.error(msg);
    }
  },

  // Refresh all dashboard data
  refreshAll: async (getToken) => {
    await Promise.all([
      get().fetchDashboardData(getToken),
      get().fetchRecentOrders(getToken),
      get().fetchQuickStats(getToken)
    ]);
  }
}));