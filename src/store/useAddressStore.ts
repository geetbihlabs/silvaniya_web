import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
}

type GetTokenFn = () => Promise<string | null>;

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAddresses: (getToken: GetTokenFn) => Promise<void>;
  addAddress: (getToken: GetTokenFn, data: Omit<Address, 'id' | 'country'> & { country?: string }) => Promise<void>;
  updateAddress: (getToken: GetTokenFn, id: string, data: Partial<Address>) => Promise<void>;
  setDefaultAddress: (getToken: GetTokenFn, id: string) => Promise<void>;
  deleteAddress: (getToken: GetTokenFn, id: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async (getToken) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await api.get('/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data?.data ?? response.data;
      set({ addresses: data, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch addresses:', error);
      set({ error: 'Failed to fetch addresses', isLoading: false });
    }
  },

  addAddress: async (getToken, data) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      // The label field in frontend form is stored as landmark in DB (or label if we sent it)
      const payload = {
        ...data,
      };

      await api.post('/addresses', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      await get().fetchAddresses(getToken);
      toast.success('Address added successfully');
    } catch (error: any) {
      console.error('Add address error:', error);
      set({ error: 'Failed to add address', isLoading: false });
      toast.error('Failed to add address');
      throw error;
    }
  },

  updateAddress: async (getToken, id, data) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      await api.patch(`/addresses/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      await get().fetchAddresses(getToken);
      toast.success('Address updated successfully');
    } catch (error: any) {
      console.error('Update address error:', error);
      set({ error: 'Failed to update address', isLoading: false });
      toast.error('Failed to update address');
      throw error;
    }
  },

  setDefaultAddress: async (getToken, id) => {
    try {
      // Optimistic update
      set((state) => ({
        addresses: state.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        })),
      }));

      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      await api.patch(`/addresses/${id}/set-default`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Default address updated');
    } catch (error: any) {
      console.error('Set default address error:', error);
      // Revert optimism
      await get().fetchAddresses(getToken);
      toast.error('Failed to set default address');
    }
  },

  deleteAddress: async (getToken, id) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      await api.delete(`/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      await get().fetchAddresses(getToken);
      toast.success('Address removed');
    } catch (error: any) {
      console.error('Delete address error:', error);
      set({ error: 'Failed to delete address', isLoading: false });
      toast.error('Failed to delete address');
      throw error;
    }
  },
}));
