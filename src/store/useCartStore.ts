/**
 * useCartStore — server-synced cart store.
 *
 * For signed-in users: every mutation is persisted to the backend API.
 * For guests (not signed in): mutations are local-only (localStorage) and
 * will be synced to the server after login.
 *
 * All methods that touch the API accept `getToken` from Clerk's `useAuth()`.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;               // CartItem row id (from server) or temp id (guest)
  productVariantId: string;
  productId?: string;       // Parent product id (from productVariant.product.id)
  categoryId?: string;      // Category id (from productVariant.product.categoryId)
  productName: string;
  variantLabel: string;
  sku: string;
  imageUrl?: string;
  unitPrice: number;        // numeric rupees
  quantity: number;
  stockQty: number;
  productSlug?: string;     // for linking back to product page
  /** True when admin has "Allow Partial Payment (Booking)" ticked for this product */
  allowPartialPayment?: boolean;
  /** Admin-defined minimum booking amount in INR — used for COD orders */
  minBookingAmount?: number;
}

export interface CartTotals {
  subtotal: number;
  shippingCharge: number;
  cgst: number;
  sgst: number;
  discountAmount: number;
  total: number;
  count: number;            // total item quantity (used for badge)
}

type GetTokenFn = () => Promise<string | null>;

interface CartState {
  items: CartItem[];
  count: number;            // mirrors getTotals().count — cached for badge
  isOpen: boolean;
  isLoading: boolean;
  coupon: { code: string; discountAmount: number } | null;

  // ── Server-syncing actions (pass getToken for authenticated calls) ──
  fetchCart: (getToken: GetTokenFn) => Promise<void>;
  mergeAndFetchCart: (getToken: GetTokenFn) => Promise<void>;
  fetchCount: (getToken: GetTokenFn) => Promise<void>;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { unitPrice: number }, qty: number, getToken: GetTokenFn) => Promise<void>;
  removeItem: (productVariantId: string, getToken: GetTokenFn) => Promise<void>;
  updateQty: (productVariantId: string, qty: number, getToken: GetTokenFn) => Promise<void>;
  clearCart: (getToken: GetTokenFn) => Promise<void>;
  applyCoupon: (code: string, getToken: GetTokenFn) => Promise<void>;
  removeCoupon: () => void;

  // ── Local helpers ──
  getTotals: (shippingMethod?: 'standard' | 'express') => CartTotals;
  setOpen: (open: boolean) => void;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function computeCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/** Build the Authorization header from a Clerk token. */
async function authHeader(getToken: GetTokenFn): Promise<Record<string, string>> {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Map a server CartItem response to our local CartItem shape. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapServerItem(raw: any): CartItem {
  return {
    id: raw.id,
    productVariantId: raw.productVariantId,
    productId: raw.productVariant?.product?.id ?? undefined,
    categoryId: raw.productVariant?.product?.categoryId ?? undefined,
    productName: raw.productName,
    variantLabel: raw.variantLabel,
    sku: raw.sku,
    imageUrl: raw.imageUrl ?? undefined,
    unitPrice: parseFloat(raw.unitPrice),
    quantity: raw.quantity,
    stockQty: raw.productVariant?.stockQty ?? 999,
    productSlug: raw.productVariant?.product?.slug ?? undefined,
    allowPartialPayment: raw.productVariant?.product?.allowPartialPayment ?? false,
    minBookingAmount:
      raw.productVariant?.product?.minBookingAmount != null
        ? parseFloat(String(raw.productVariant.product.minBookingAmount))
        : undefined,
  };
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      isOpen: false,
      isLoading: false,
      coupon: null,

      // ── Fetch full cart from server ─────────────────────────────────────
      fetchCart: async (getToken) => {
        set({ isLoading: true });
        try {
          const headers = await authHeader(getToken);
          const res = await api.get('/cart', { headers });
          const cart = res.data?.data ?? res.data;
          const items: CartItem[] = (cart?.items ?? []).map(mapServerItem);
          set({ items, count: computeCount(items), isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      // ── Merge guest local items → server, then fetch ────────────────────
      mergeAndFetchCart: async (getToken) => {
        set({ isLoading: true });
        try {
          const localItems = get().items.filter((i) => i.id.startsWith('temp-'));
          if (localItems.length > 0) {
            const headers = await authHeader(getToken);
            // Push each guest item to server (fire-and-forget per item)
            await Promise.allSettled(
              localItems.map((item) =>
                api.post(
                  '/cart/items',
                  {
                    productVariantId: item.productVariantId,
                    productName: item.productName,
                    variantLabel: item.variantLabel,
                    sku: item.sku,
                    imageUrl: item.imageUrl,
                    unitPrice: String(item.unitPrice),
                    quantity: item.quantity,
                  },
                  { headers },
                ),
              ),
            );
          }
          // Now fetch the authoritative server cart
          const headers = await authHeader(getToken);
          const res = await api.get('/cart', { headers });
          const cart = res.data?.data ?? res.data;
          const items: CartItem[] = (cart?.items ?? []).map(mapServerItem);
          set({ items, count: computeCount(items), isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      // ── Fetch count only (lightweight — for badge) ──────────────────────
      fetchCount: async (getToken) => {
        try {
          const headers = await authHeader(getToken);
          const res = await api.get('/cart/count', { headers });
          // API wraps: { success, data: { count: N }, meta }
          const payload = res.data?.data ?? res.data;
          set({ count: payload?.count ?? 0 });
        } catch {
          // Silently fail — badge will fall back to local count
          set({ count: computeCount(get().items) });
        }
      },

      // ── Add item ────────────────────────────────────────────────────────
      addItem: async (itemData, qty = 1, getToken) => {
        const state = get();
        const existing = state.items.find((i) => i.productVariantId === itemData.productVariantId);
        const stockQty = existing?.stockQty ?? itemData.stockQty;
        
        if (existing && existing.quantity + qty > stockQty) {
          toast.error(`Only ${stockQty} items available in stock`);
          return;
        } else if (!existing && qty > stockQty) {
          toast.error(`Only ${stockQty} items available in stock`);
          return;
        }

        // Optimistic update
        set((state) => {
          let items: CartItem[];
          if (existing) {
            items = state.items.map((i) =>
              i.productVariantId === itemData.productVariantId
                ? { ...i, quantity: i.quantity + qty }
                : i,
            );
          } else {
            items = [
              ...state.items,
              { ...itemData, id: `temp-${Date.now()}`, quantity: qty },
            ];
          }
          return { items, count: computeCount(items) };
        });

        toast.success(`${itemData.productName} added to cart!`);

        try {
          const headers = await authHeader(getToken);
          const res = await api.post(
            '/cart/items',
            {
              productVariantId: itemData.productVariantId,
              productName: itemData.productName,
              variantLabel: itemData.variantLabel,
              sku: itemData.sku,
              imageUrl: itemData.imageUrl,
              unitPrice: String(itemData.unitPrice),
              quantity: qty,
            },
            { headers },
          );
          // API wraps: { success, data: { id, productVariantId, ... }, meta }
          const saved = mapServerItem(res.data?.data ?? res.data);
          set((state) => {
            const items = state.items.map((i) =>
              i.productVariantId === saved.productVariantId ? saved : i,
            );
            return { items, count: computeCount(items) };
          });
        } catch {
          // Optimistic update stays — will reconcile on next fetchCart
        }
      },

      // ── Remove item ─────────────────────────────────────────────────────
      removeItem: async (productVariantId, getToken) => {
        // Optimistic update
        set((state) => {
          const items = state.items.filter(
            (i) => i.productVariantId !== productVariantId,
          );
          return { items, count: computeCount(items) };
        });

        try {
          const headers = await authHeader(getToken);
          await api.delete(`/cart/items/${productVariantId}`, { headers });
        } catch {
          // Reconcile on next fetchCart
        }
      },

      // ── Update quantity ─────────────────────────────────────────────────
      updateQty: async (productVariantId, qty, getToken) => {
        if (qty < 1) {
          return get().removeItem(productVariantId, getToken);
        }
        
        const state = get();
        const existing = state.items.find((i) => i.productVariantId === productVariantId);
        if (existing && qty > existing.stockQty) {
          toast.error(`Only ${existing.stockQty} items available in stock`);
          return;
        }

        // Optimistic update
        set((state) => {
          const items = state.items.map((i) =>
            i.productVariantId === productVariantId ? { ...i, quantity: qty } : i,
          );
          return { items, count: computeCount(items) };
        });

        try {
          const headers = await authHeader(getToken);
          await api.patch(
            `/cart/items/${productVariantId}`,
            { quantity: qty },
            { headers },
          );
        } catch {
          // Reconcile on next fetchCart
        }
      },

      // ── Clear cart ──────────────────────────────────────────────────────
      clearCart: async (getToken) => {
        set({ items: [], count: 0 });

        try {
          const headers = await authHeader(getToken);
          await api.delete('/cart', { headers });
        } catch {
          // Reconcile on next fetchCart
        }
      },

      // ── Apply coupon code ────────────────────────────────────────────────
      applyCoupon: async (code, getToken) => {
        try {
          const subtotal = get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
          const headers = await authHeader(getToken);
          const res = await api.post('/discounts/validate', { code: code.trim().toUpperCase(), subtotal }, { headers });
          const result = res.data?.data ?? res.data;
          if (result?.valid) {
            set({ coupon: { code: result.code, discountAmount: result.discountAmount } });
            toast.success(result.message);
          } else {
            toast.error(result?.message ?? 'Invalid coupon code.');
          }
        } catch {
          toast.error('Failed to validate coupon. Please try again.');
        }
      },

      // ── Remove coupon ────────────────────────────────────────────────────
      removeCoupon: () => set({ coupon: null }),

      // ── Local helpers ───────────────────────────────────────────────────
      getTotals: (shippingMethod = 'standard') => {
        void shippingMethod; // retained for API compat — shipping is always free
        const { items, coupon } = get();
        const subtotal = items.reduce(
          (sum, i) => sum + i.unitPrice * i.quantity,
          0,
        );
        const discountAmount = coupon?.discountAmount ?? 0;
        const discounted = Math.max(0, subtotal - discountAmount);
        // GST is inclusive in product prices — do not add extra tax
        // Shipping is always free (Standard only)
        const total = discounted;
        const count = computeCount(items);
        return { subtotal, shippingCharge: 0, cgst: 0, sgst: 0, discountAmount, total, count };
      },

      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: 'silvaniya-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items/count for guest fallback
      partialize: (state) => ({ items: state.items, count: state.count, coupon: state.coupon }),
    },
  ),
);
