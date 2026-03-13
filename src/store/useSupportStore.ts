import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import supportService from '@/services/support.service';
import { 
  SupportTicket, 
  TicketStatus, 
  TicketPriority, 
  TicketReply 
} from '@/types/admin.types';

interface SupportState {
  // Tickets
  tickets: SupportTicket[];
  currentTicket: (SupportTicket & {
    user: any;
    order?: any;
    replies: TicketReply[];
  }) | null;
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
    status?: TicketStatus;
    priority?: TicketPriority;
    search?: string;
  };
  
  // Stats
  stats: {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    avgResponseTime: number;
    satisfactionScore: number;
  };

  // Actions
  fetchTickets: (params?: {
    page?: number;
    limit?: number;
    status?: TicketStatus;
    priority?: TicketPriority;
    search?: string;
  }) => Promise<void>;
  
  fetchTicketById: (id: string) => Promise<void>;
  
  createTicket: (data: {
    subject: string;
    description: string;
    priority: TicketPriority;
    orderId?: string;
  }) => Promise<SupportTicket>;
  
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<void>;
  
  assignTicket: (id: string, agentId: string) => Promise<void>;
  
  closeTicket: (id: string) => Promise<void>;
  
  replyToTicket: (ticketId: string, data: {
    body: string;
    isInternalNote?: boolean;
  }) => Promise<void>;
  
  fetchStats: () => Promise<void>;
  
  setFilters: (filters: Partial<{
    status?: TicketStatus;
    priority?: TicketPriority;
    search?: string;
  }>) => void;
  
  clearError: () => void;
  
  reset: () => void;
}

const initialState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  stats: {
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgResponseTime: 0,
    satisfactionScore: 0,
  },
};

export const useSupportStore = create<SupportState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchTickets: async (params = {}) => {
        set({ loading: true, error: null });
        
        try {
          const response = await supportService.getTickets({
            ...get().filters,
            ...params,
          });
          
          set({
            tickets: response.data,
            pagination: response.meta,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch tickets',
            loading: false,
          });
        }
      },

      fetchTicketById: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const ticket = await supportService.getTicketById(id);
          set({
            currentTicket: ticket,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch ticket',
            loading: false,
          });
        }
      },

      createTicket: async (data) => {
        set({ loading: true, error: null });
        
        try {
          const ticket = await supportService.createTicket(data);
          set({ loading: false });
          return ticket;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to create ticket',
            loading: false,
          });
          throw error;
        }
      },

      updateTicketStatus: async (id: string, status: TicketStatus) => {
        set({ loading: true, error: null });
        
        try {
          await supportService.updateTicketStatus(id, { status });
          // Update local state
          set(state => ({
            tickets: state.tickets.map(ticket => 
              ticket.id === id ? { ...ticket, status } : ticket
            ),
            currentTicket: state.currentTicket 
              ? { ...state.currentTicket, status } 
              : null,
            loading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to update ticket status',
            loading: false,
          });
          throw error;
        }
      },

      assignTicket: async (id: string, agentId: string) => {
        set({ loading: true, error: null });
        
        try {
          await supportService.assignTicket(id, { agentId });
          // Update local state
          set(state => ({
            tickets: state.tickets.map(ticket => 
              ticket.id === id ? { ...ticket, assignedTo: agentId } : ticket
            ),
            currentTicket: state.currentTicket 
              ? { ...state.currentTicket, assignedToId: agentId } 
              : null,
            loading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to assign ticket',
            loading: false,
          });
          throw error;
        }
      },

      closeTicket: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          await supportService.closeTicket(id);
          // Update local state
          set(state => ({
            tickets: state.tickets.map(ticket => 
              ticket.id === id ? { ...ticket, status: 'RESOLVED' } : ticket
            ),
            currentTicket: state.currentTicket 
              ? { ...state.currentTicket, status: 'RESOLVED' } 
              : null,
            loading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to close ticket',
            loading: false,
          });
          throw error;
        }
      },

      replyToTicket: async (ticketId: string, data) => {
        set({ loading: true, error: null });
        
        try {
          await supportService.replyToTicket(ticketId, data);
          // Refresh ticket to get updated replies
          await get().fetchTicketById(ticketId);
          set({ loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to send reply',
            loading: false,
          });
          throw error;
        }
      },

      fetchStats: async () => {
        try {
          const stats = await supportService.getSupportStats();
          set({ stats });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch stats',
          });
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
      name: 'support-store',
    }
  )
);