import api from '@/lib/axios';

function authHeaders(token: string | null) {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : { headers: {} };
}

export interface Notification {
  id: string;
  userId: string | null;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  metadata: Record<string, string> | null;
  createdAt: string;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsResponse {
  data: Notification[];
  meta: NotificationMeta;
}

export const notificationService = {
  async getMyNotifications(
    token: string | null,
    page = 1,
    limit = 20,
  ): Promise<NotificationsResponse> {
    const res = await api.get('/notifications/my', {
      params: { page, limit },
      ...authHeaders(token),
    });
    return res.data;
  },

  async getUnreadCount(token: string | null): Promise<number> {
    const res = await api.get('/notifications/my/unread-count', authHeaders(token));
    const payload = res.data?.data ?? res.data;
    return payload?.count ?? 0;
  },

  async markAsRead(id: string, token: string | null): Promise<void> {
    await api.patch(`/notifications/${id}/read`, {}, authHeaders(token));
  },

  async markAllAsRead(token: string | null): Promise<void> {
    await api.patch('/notifications/read-all', {}, authHeaders(token));
  },

  // -------------------------------------------------------------
  // ADMIN NOTIFICATIONS (Clerk role restricted, hits userId: null)
  // -------------------------------------------------------------
  async getAdminNotifications(
    token: string | null,
    page = 1,
    limit = 20,
  ): Promise<NotificationsResponse> {
    const res = await api.get('/notifications/admin', {
      params: { page, limit },
      ...authHeaders(token),
    });
    return res.data;
  },

  async getAdminUnreadCount(token: string | null): Promise<number> {
    const res = await api.get('/notifications/admin/unread-count', authHeaders(token));
    const payload = res.data?.data ?? res.data;
    return payload?.count ?? 0;
  },

  async markAdminAsRead(id: string, token: string | null): Promise<void> {
    await api.patch(`/notifications/admin/${id}/read`, {}, authHeaders(token));
  },

  async markAllAdminAsRead(token: string | null): Promise<void> {
    await api.patch('/notifications/admin/read-all', {}, authHeaders(token));
  },
};

