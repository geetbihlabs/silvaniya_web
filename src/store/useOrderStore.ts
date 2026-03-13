import { create } from 'zustand';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { CartItem } from './useCartStore';

export interface OrderAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  shippingCharge: number;
  totalAmount: number;
  items: {
    id: string;
    productName: string;
    variantLabel: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productVariant?: {
      product?: {
        images?: { s3Url: string; isPrimary: boolean }[];
      };
    };
  }[];
  shippingAddress: OrderAddress & { id: string };
  statusHistory: { status: string; note?: string; createdAt: string }[];
  createdAt: string;
}

interface OrderState {
  order: PlacedOrder | null;
  orders: PlacedOrder[];
  isLoading: boolean;
  isPlacing: boolean;
  error: string | null;
  placeOrder: (
    cartItems: CartItem[],
    address: OrderAddress,
    shippingMethod: 'standard' | 'express',
    paymentMethod: string,
    getToken: () => Promise<string | null>,
  ) => Promise<PlacedOrder | null>;
  fetchOrderById: (id: string, getToken: () => Promise<string | null>) => Promise<PlacedOrder | null>;
  fetchMyOrders: (getToken: () => Promise<string | null>, page?: number) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  order: null,
  orders: [],
  isLoading: false,
  isPlacing: false,
  error: null,

  placeOrder: async (cartItems, address, shippingMethod, paymentMethod, getToken) => {
    set({ isPlacing: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        items: cartItems.map((item) => ({
          productVariantId: item.productVariantId,
          productName: item.productName,
          variantLabel: item.variantLabel,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toFixed(2),
        })),
        shippingAddress: address,
        paymentMethod,
        shippingMethod,
      };

      const res = await api.post('/orders', payload, { headers });
      const placedOrder: PlacedOrder = res.data?.data ?? res.data;
      set({ order: placedOrder, isPlacing: false });
      toast.success('Order placed successfully!');
      return placedOrder;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to place order. Please try again.';
      set({ error: msg, isPlacing: false });
      toast.error(msg);
      return null;
    }
  },

  fetchOrderById: async (id, getToken) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get(`/orders/${id}`, { headers });
      const order: PlacedOrder = res.data?.data ?? res.data;
      set({ order, isLoading: false });
      return order;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to load order details.';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return null;
    }
  },

  fetchMyOrders: async (getToken, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get('/orders/my', { headers, params: { page, limit: 20 } });
      const orders: PlacedOrder[] = res.data?.data ?? [];
      set({ orders, isLoading: false });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to load orders.';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },
}));
