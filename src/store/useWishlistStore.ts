import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WishlistItem {
  productId: string;
  productName: string;
  slug: string;
  category?: string;
  imageUrl: string | null;
  price: number;
  basePrice: number;
  salePrice: number | null;
  addedAt: Date | string;
  inStock: boolean;
}

type GetTokenFn = () => Promise<string | null>;

interface WishlistState {
  items: WishlistItem[];
  count: number;
  isLoading: boolean;
  initialized: boolean;

  // ── Server-syncing actions (pass getToken for authenticated calls) ──
  fetchWishlist: (getToken: GetTokenFn) => Promise<void>;
  addItem: (product: WishlistItem, getToken: GetTokenFn) => Promise<void>;
  removeItem: (productId: string, getToken: GetTokenFn) => Promise<void>;
  clearWishlist: (getToken: GetTokenFn) => Promise<void>;

  // ── Local helpers ──
  isInWishlist: (productId: string) => boolean;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

/** Build the Authorization header from a Clerk token. */
async function authHeader(getToken: GetTokenFn): Promise<Record<string, string>> {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      isLoading: false,
      initialized: false,

      // ── Fetch full wishlist from server ─────────────────────────────────────
      fetchWishlist: async (getToken) => {
        set({ isLoading: true });
        try {
          const headers = await authHeader(getToken);
          // If no token, user is guest. Keep using persisted local storage data.
          if (!headers.Authorization) {
            set({ isLoading: false });
            return;
          }

          const res = await api.get('/wishlist', { headers });
          const items = res.data?.data ?? [];
          set({ items, count: items.length, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      // ── Add item ────────────────────────────────────────────────────────
      addItem: async (product, getToken) => {
        // Optimistic update
        if (get().isInWishlist(product.productId)) return; // prevent duplicates

        set((state) => {
          const newItems = [...state.items, product];
          return { items: newItems, count: newItems.length };
        });

        toast.success(`${product.productName} added to wishlist!`);

        try {
          const headers = await authHeader(getToken);
          // Only sync if logged in
          if (headers.Authorization) {
            await api.post(`/wishlist/${product.productId}`, {}, { headers });
          }
        } catch {
          // Revert optimistic update on failure (optional) or silently fail
          // Reconcile on next fetchWishlist
        }
      },

      // ── Remove item ─────────────────────────────────────────────────────
      removeItem: async (productId, getToken) => {
        // Optimistic update
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          return { items: newItems, count: newItems.length };
        });

        toast.success(`Item removed from wishlist.`);

        try {
          const headers = await authHeader(getToken);
          if (headers.Authorization) {
            await api.delete(`/wishlist/${productId}`, { headers });
          }
        } catch {
          // Reconcile on next fetchWishlist
        }
      },

      // ── Clear wishlist ──────────────────────────────────────────────────────
      clearWishlist: async (getToken) => {
        set({ items: [], count: 0 });

        try {
          const headers = await authHeader(getToken);
          if (headers.Authorization) {
            // Depending on if the API supports clearing everything or requires a loop.
            // For now, if no endpoint exists, let's just clear locally. 
            // In a real scenario, you might add a DELETE /wishlist route.
          }
        } catch {
          // Reconcile on next fetchWishlist
        }
      },

      // ── Local helpers ───────────────────────────────────────────────────
      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },
    }),
    {
      name: 'silvaniya-wishlist',
      storage: createJSONStorage(() => localStorage),
      // Persist items for guest fallback; when logged in, fetchWishlist overrides this
      partialize: (state) => ({ items: state.items, count: state.count }),
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.initialized = true;
        }
      },
    },
  ),
);
