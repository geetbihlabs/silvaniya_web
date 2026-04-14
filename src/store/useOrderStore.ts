// src/store/useOrderStore.ts
import { create } from 'zustand';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { CartItem } from './useCartStore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderAddress {
  id?: string;
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
  paymentMethod: string;
  subtotal: number;
  discountAmount: number;
  discountCode?: string | null;
  cgst: number;
  sgst: number;
  shippingCharge: number;
  totalAmount: number;
  upfrontPaymentAmount?: number | null;
  gatewayOrderId?: string | null;
  gatewayPaymentId?: string | null;
  items: {
    id: string;
    productName: string;
    variantLabel: string;
    sku: string;
    quantity: number;
    returnedQty: number;
    unitPrice: number;
    totalPrice: number;
    effectivePrice: number;
    discountAllocated: number;
    status: string;  // OrderItemStatus
    productVariant?: {
      product?: {
        images?: { s3Url: string; isPrimary: boolean }[];
        returnWindowDays?: number;
        isReturnable?: boolean;
      };
    };
  }[];
  returns?: {
    id: string;
    status: string;
    refundAmount: number;
    reason: string;
    requestedAt: string;
    items: { orderItemId: string; quantity: number }[];
  }[];
  shippingAddress: OrderAddress & { id: string };
  statusHistory: { status: string; note?: string; createdAt: string }[];
  awbNumber?: string | null;
  courierPartner?: string | null;
  trackingUrl?: string | null;
  createdAt: string;
}

export interface RazorpayOrderData {
  razorpayOrderId: string;
  amount: number;   // in paisa
  currency: string;
  orderId: string;
  keyId: string;
}

type GetTokenFn = () => Promise<string | null>;

// ─── State Shape ──────────────────────────────────────────────────────────────

interface OrderState {
  order: PlacedOrder | null;
  orders: PlacedOrder[];
  isLoading: boolean;
  isPlacing: boolean;
  isInitiatingPayment: boolean;
  error: string | null;

  /** Creates a DB order record with PENDING_PAYMENT status */
  placeOrder: (
    cartItems: CartItem[],
    address: OrderAddress,
    paymentMethod: string,
    couponCode: string | undefined,
    getToken: GetTokenFn,
  ) => Promise<PlacedOrder | null>;

  /** Calls the backend to create a Razorpay order and returns modal credentials */
  initiateRazorpayPayment: (
    orderId: string,
    getToken: GetTokenFn,
  ) => Promise<RazorpayOrderData | null>;

  /** Verifies the HMAC signature after Razorpay modal success */
  verifyRazorpayPayment: (
    dto: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      orderId: string;
    },
    getToken: GetTokenFn,
  ) => Promise<boolean>;

  fetchOrderById: (id: string, getToken: GetTokenFn) => Promise<PlacedOrder | null>;
  fetchMyOrders: (getToken: GetTokenFn, page?: number) => Promise<void>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useOrderStore = create<OrderState>((set) => ({
  order: null,
  orders: [],
  isLoading: false,
  isPlacing: false,
  isInitiatingPayment: false,
  error: null,

  placeOrder: async (
    cartItems,
    address,
    paymentMethod,
    couponCode,
    getToken,
  ) => {
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
        shippingAddressId: address.id, // Only present if reusing existing
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country,
        },
        paymentMethod,
        shippingMethod: 'standard', // always standard — free shipping
        couponCode: couponCode || undefined,
      };

      const res = await api.post('/orders', payload, { headers });
      const placedOrder: PlacedOrder = res.data?.data ?? res.data;
      set({ order: placedOrder, isPlacing: false });
      return placedOrder;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to place order. Please try again.';
      set({ error: msg, isPlacing: false });
      toast.error(msg);
      return null;
    }
  },

  initiateRazorpayPayment: async (orderId, getToken) => {
    set({ isInitiatingPayment: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.post(
        '/payments/razorpay/create-order',
        { orderId },
        { headers },
      );
      const data: RazorpayOrderData = res.data?.data ?? res.data;
      set({ isInitiatingPayment: false });
      return data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to initiate payment. Please try again.';
      set({ error: msg, isInitiatingPayment: false });
      toast.error(msg);
      return null;
    }
  },

  verifyRazorpayPayment: async (dto, getToken) => {
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.post('/payments/razorpay/verify', dto, { headers });
      toast.success('Payment successful! Your order is confirmed.');
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        'Payment verification failed. Please contact support with your order number.';
      toast.error(msg);
      return false;
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
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to load order details.';
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
      const res = await api.get('/orders/my', {
        headers,
        params: { page, limit: 20 },
      });
      const orders: PlacedOrder[] = res.data?.data ?? [];
      set({ orders, isLoading: false });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to load orders.';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },
}));
