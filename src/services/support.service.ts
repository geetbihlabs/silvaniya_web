import api from '@/lib/axios';
import { 
  SupportTicket, 
  TicketStatus, 
  TicketPriority, 
  TicketReply,
  AdminCustomer,
  AdminOrder
} from '@/types/admin.types';

// Ticket related interfaces
interface CreateTicketDto {
  subject: string;
  description: string;
  priority: TicketPriority;
  orderId?: string;
}

interface UpdateTicketStatusDto {
  status: TicketStatus;
}

interface AssignTicketDto {
  agentId: string;
}

interface ReplyTicketDto {
  body: string;
  isInternalNote?: boolean;
}

// Review related interfaces
interface ModerateReviewDto {
  status: 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'PENDING';
}

interface ReplyReviewDto {
  adminReply: string;
}

// Canned response interfaces
interface CannedResponse {
  id: string;
  title: string;
  body: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Response interfaces
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Mapper: raw Prisma ticket → SupportTicket ───────────────────────────────
function mapTicket(raw: any): SupportTicket {
  const user = raw.user ?? {};
  const agent = raw.assignedTo ?? null;
  return {
    ...raw,
    // flatten customer fields
    customerId: raw.userId,
    customerName: [user.firstName, user.lastName].filter(Boolean).join(' ') || raw.userId,
    customerEmail: user.email ?? '',
    // flatten assigned agent to display name string
    assignedTo: agent
      ? [agent.firstName, agent.lastName].filter(Boolean).join(' ')
      : undefined,
    // ensure replies array exists
    replies: raw.replies ?? [],
  };
}

class SupportService {
  // Tickets APIs
  async getTickets(params?: {
    page?: number;
    limit?: number;
    status?: TicketStatus;
    priority?: TicketPriority;
    search?: string;
  }): Promise<PaginatedResponse<SupportTicket>> {
    const response = await api.get('/tickets', { params });
    const payload = response.data?.data ?? response.data;
    return {
      data: (payload.data ?? []).map(mapTicket),
      meta: payload.meta ?? response.data?.meta,
    };
  }

  async getTicketById(id: string): Promise<SupportTicket & {
    user: AdminCustomer;
    order?: AdminOrder;
    replies: TicketReply[];
  }> {
    const response = await api.get(`/tickets/${id}`);
    const raw = response.data?.data ?? response.data;
    return mapTicket(raw) as any;
  }


  async createTicket(data: CreateTicketDto): Promise<SupportTicket> {
    const response = await api.post('/tickets', data);
    return response.data;
  }

  async updateTicketStatus(id: string, data: UpdateTicketStatusDto): Promise<void> {
    await api.patch(`/tickets/${id}/status`, data);
  }

  async assignTicket(id: string, data: AssignTicketDto): Promise<void> {
    await api.patch(`/tickets/${id}/assign/${data.agentId}`);
  }

  async closeTicket(id: string): Promise<void> {
    await api.patch(`/tickets/${id}/close`);
  }

  // Ticket Replies APIs
  async replyToTicket(ticketId: string, data: ReplyTicketDto): Promise<void> {
    await api.post(`/tickets/${ticketId}/replies`, data);
  }

  // Reviews APIs
  async getReviews(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<any>> {
    const response = await api.get('/reviews', { params });
    return response.data;
  }

  async moderateReview(id: string, data: ModerateReviewDto): Promise<void> {
    await api.patch(`/reviews/${id}/moderate`, data);
  }

  async replyToReview(id: string, data: ReplyReviewDto): Promise<void> {
    await api.patch(`/reviews/${id}/reply`, data);
  }

  // Canned Responses APIs
  async getCannedResponses(): Promise<CannedResponse[]> {
    const response = await api.get('/canned-responses');
    return response.data;
  }

  async createCannedResponse(data: Omit<CannedResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<CannedResponse> {
    const response = await api.post('/canned-responses', data);
    return response.data;
  }

  async updateCannedResponse(id: string, data: Partial<Omit<CannedResponse, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CannedResponse> {
    const response = await api.patch(`/canned-responses/${id}`, data);
    return response.data;
  }

  async deleteCannedResponse(id: string): Promise<void> {
    await api.delete(`/canned-responses/${id}`);
  }

  // Statistics APIs
  async getSupportStats(): Promise<{
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    avgResponseTime: number;
    satisfactionScore: number;
  }> {
    const response = await api.get('/support/stats');
    return response.data;
  }
}

export default new SupportService();