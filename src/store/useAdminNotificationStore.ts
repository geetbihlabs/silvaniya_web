import { create } from 'zustand';
import { notificationService, Notification } from '@/services/notificationService';
import { toast } from 'react-hot-toast';

interface AdminNotificationState {
  notifications: Notification[];
  unreadCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;

  fetchNotifications: (getToken: () => Promise<string | null>, page?: number) => Promise<void>;
  fetchUnreadCount: (getToken: () => Promise<string | null>) => Promise<void>;
  markAsRead: (id: string, getToken: () => Promise<string | null>) => Promise<void>;
  markAllAsRead: (getToken: () => Promise<string | null>) => Promise<void>;
}

export const useAdminNotificationStore = create<AdminNotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,

  fetchNotifications: async (getToken, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      const res = await notificationService.getAdminNotifications(token, page);
      set({
        notifications: res.data ?? [],
        totalPages: res.meta?.totalPages ?? 1,
        currentPage: page,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false, error: 'Failed to load admin notifications.' });
    }
  },

  fetchUnreadCount: async (getToken) => {
    try {
      const token = await getToken();
      const count = await notificationService.getAdminUnreadCount(token);
      set({ unreadCount: count });
    } catch {
      // silently ignore
    }
  },

  markAsRead: async (id, getToken) => {
    try {
      const token = await getToken();
      await notificationService.markAdminAsRead(id, token);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      toast.error('Failed to mark notification as read.');
    }
  },

  markAllAsRead: async (getToken) => {
    try {
      const token = await getToken();
      await notificationService.markAllAdminAsRead(token);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
      toast.success('All notifications marked as read.');
    } catch {
      toast.error('Failed to mark all as read.');
    }
  },
}));
