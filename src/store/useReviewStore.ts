import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import supportService from '@/services/support.service';

interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId?: string;
  rating: number;
  title?: string;
  body?: string;
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  adminReply?: string;
  adminReplyAt?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  product: {
    name: string;
    sku: string;
  };
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filters
  filters: {
    status?: string;
  };

  // Actions
  fetchReviews: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => Promise<void>;
  
  moderateReview: (id: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'PENDING') => Promise<void>;
  
  replyToReview: (id: string, adminReply: string) => Promise<void>;
  
  setFilters: (filters: Partial<{ status?: string }>) => void;
  
  clearError: () => void;
  
  reset: () => void;
}

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

export const useReviewStore = create<ReviewState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchReviews: async (params = {}) => {
        set({ loading: true, error: null });
        
        try {
          const response = await supportService.getReviews({
            ...get().filters,
            ...params,
          });
          
          set({
            reviews: response.data,
            pagination: response.meta,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch reviews',
            loading: false,
          });
        }
      },

      moderateReview: async (id: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'PENDING') => {
        set({ loading: true, error: null });
        
        try {
          await supportService.moderateReview(id, { status });
          // Update local state
          set(state => ({
            reviews: state.reviews.map(review => 
              review.id === id ? { ...review, status } : review
            ),
            loading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to moderate review',
            loading: false,
          });
          throw error;
        }
      },

      replyToReview: async (id: string, adminReply: string) => {
        set({ loading: true, error: null });
        
        try {
          await supportService.replyToReview(id, { adminReply });
          // Update local state
          set(state => ({
            reviews: state.reviews.map(review => 
              review.id === id ? { ...review, adminReply, adminReplyAt: new Date().toISOString() } : review
            ),
            loading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to reply to review',
            loading: false,
          });
          throw error;
        }
      },

      setFilters: (filters) => {
        set(state => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'review-store',
    }
  )
);