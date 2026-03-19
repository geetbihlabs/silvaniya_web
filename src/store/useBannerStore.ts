import { create } from 'zustand';
import api from '@/lib/axios';
import axios from 'axios';
import { Banner, BannerPosition } from '@/types/admin.types';
import { toast } from 'react-hot-toast';

interface BannerState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
  fetchBanners: (getToken: () => Promise<string | null>) => Promise<void>;
  fetchActiveBanners: () => Promise<void>;
  createBanner: (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>, getToken: () => Promise<string | null>) => Promise<Banner>;
  updateBanner: (id: string, banner: Partial<Banner>, getToken: () => Promise<string | null>) => Promise<Banner>;
  deleteBanner: (id: string, getToken: () => Promise<string | null>) => Promise<void>;
  activateBanner: (id: string, getToken: () => Promise<string | null>) => Promise<Banner>;
  deactivateBanner: (id: string, getToken: () => Promise<string | null>) => Promise<Banner>;
  getActiveBanners: (getToken: () => Promise<string | null>) => Promise<Banner[]>;
  getBannersByPosition: (position: BannerPosition, getToken: () => Promise<string | null>) => Promise<Banner[]>;
  uploadImage: (file: File, getToken: () => Promise<string | null>) => Promise<string | null>;
  clearError: () => void;
}

export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  loading: false,
  error: null,

  fetchBanners: async (getToken) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.get('/banners', { headers });
      set({ 
        banners: response.data?.data || [], 
        loading: false 
      });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch banners';
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  fetchActiveBanners: async () => {
    set({ loading: true, error: null });
    try {
      // Public route - no authentication required
      const response = await api.get('/banners/active');
      set({ 
        banners: response.data?.data || [], 
        loading: false 
      });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch active banners';
      set({ error: msg, loading: false });
      // Don't show toast error for public route failures in hero section
      console.error('Failed to fetch active banners:', msg);
    }
  },

  createBanner: async (bannerData, getToken) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.post('/banners', bannerData, { headers });
      const newBanner = response.data?.data ? response.data.data : response.data;
      set((state) => ({
        banners: [...state.banners, newBanner],
        loading: false
      }));
      toast.success('Banner created successfully');
      return newBanner;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to create banner';
      set({ error: msg, loading: false });
      toast.error(msg);
      throw error;
    }
  },

  updateBanner: async (id, bannerData, getToken) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.patch(`/banners/${id}`, bannerData, { headers });
      const updatedBanner = response.data?.data ? response.data.data : response.data;
      set((state) => ({
        banners: state.banners.map(banner => 
          banner.id === id ? updatedBanner : banner
        ),
        loading: false
      }));
      toast.success('Banner updated successfully');
      return updatedBanner;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to update banner';
      set({ error: msg, loading: false });
      toast.error(msg);
      throw error;
    }
  },

  deleteBanner: async (id, getToken) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await api.delete(`/banners/${id}`, { headers });
      set((state) => ({
        banners: state.banners.filter(banner => banner.id !== id),
        loading: false
      }));
      toast.success('Banner deleted successfully');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to delete banner';
      set({ error: msg, loading: false });
      toast.error(msg);
      throw error;
    }
  },

  activateBanner: async (id, getToken) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.patch(`/banners/${id}/activate`, {}, { headers });
      const updatedBanner = response.data?.data ? response.data.data : response.data;
      set((state) => ({
        banners: state.banners.map(banner => 
          banner.id === id ? { ...banner, isActive: true } : banner
        ),
        loading: false
      }));
      toast.success('Banner activated successfully');
      return updatedBanner;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to activate banner';
      set({ error: msg, loading: false });
      toast.error(msg);
      throw error;
    }
  },

  deactivateBanner: async (id, getToken) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.patch(`/banners/${id}/deactivate`, {}, { headers });
      const updatedBanner = response.data?.data ? response.data.data : response.data;
      set((state) => ({
        banners: state.banners.map(banner => 
          banner.id === id ? { ...banner, isActive: false } : banner
        ),
        loading: false
      }));
      toast.success('Banner deactivated successfully');
      return updatedBanner;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to deactivate banner';
      set({ error: msg, loading: false });
      toast.error(msg);
      throw error;
    }
  },

  getActiveBanners: async (getToken) => {
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.get('/banners/active', { headers });
      return response.data?.data || [];
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch active banners';
      set({ error: msg });
      toast.error(msg);
      throw error;
    }
  },

  getBannersByPosition: async (position, getToken) => {
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await api.get(`/banners/position/${position}`, { headers });
      return response.data?.data || [];
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch banners by position';
      set({ error: msg });
      toast.error(msg);
      throw error;
    }
  },

  uploadImage: async (file: File, getToken: () => Promise<string | null>) => {
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const presignedRes = await api.post('/banners/presigned-url', {
        mimeType: file.type,
      }, { headers });
      
      const { uploadUrl, publicUrl } = presignedRes.data.data ? presignedRes.data.data : presignedRes.data;

      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading banner image:", error);
      toast.error("Failed to upload banner image");
      return null;
    }
  },

  clearError: () => set({ error: null })
}));
