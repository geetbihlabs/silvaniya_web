// ==================== ADMIN TYPES ====================

// Dashboard
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  avgOrderValue: number;
  revenueChange: number; // percentage change from prev period
  ordersChange: number;
  customersChange: number;
  aovChange: number;
}

export type PaymentMethod =
  | "RAZORPAY"
  | "UPI"
  | "NET_BANKING"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "CASH_ON_DELIVERY"
  | "STORE_CREDIT"
  | "EMI";

// Extended order statuses for admin (per PRD lifecycle)
export type AdminOrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "PROCESSING"
  | "QUALITY_CHECK"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURN_REQUESTED"
  | "RETURN_APPROVED"
  | "RETURN_REJECTED"
  | "RETURNED"
  | "REFUNDED"
  | "CANCELLED";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: AdminOrderStatus;
  items: AdminOrderItem[];
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  transactionId?: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  trackingNumber?: string;
  internalNotes?: string[];
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  variantInfo?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderTimelineEvent {
  id: string;
  status: AdminOrderStatus;
  message: string;
  actor: string;
  timestamp: string;
}

// Customer Management
export interface AdminCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastPurchaseDate?: string;
  loyaltyTier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  status: "ACTIVE" | "BLOCKED" | "INACTIVE";
  registeredAt: string;
  city?: string;
  state?: string;
}

// Support Tickets
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING_ON_CUSTOMER" | "RESOLVED" | "CLOSED";
export type TicketPriority = "URGENT" | "HIGH" | "NORMAL" | "LOW";

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderId?: string;
  orderNumber?: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  replies: TicketReply[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TicketReply {
  id: string;
  ticketId: string;
  author: string;
  authorRole: "CUSTOMER" | "AGENT" | "SYSTEM";
  message: string;
  isInternal: boolean; // internal notes not visible to customer
  createdAt: string;
}

// Product (admin-extended)
export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: "RINGS" | "NECKLACES" | "BANGLES" | "EARRINGS" | "BRACELETS" | "PENDANTS" | "CHAINS" | "ANKLETS" | "NOSE_PINS" | "MAANG_TIKKA" | "OTHER";
  collection?: string;
  material: "GOLD_22K" | "GOLD_18K" | "GOLD_14K" | "PLATINUM" | "SILVER_925" | "SILVER_999" | "WHITE_GOLD" | "ROSE_GOLD" | "OTHER";
  basePrice: number;
  salePrice?: number;
  stock: number;
  lowStockThreshold: number;
  weight: number; // in grams
  visibility: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  images: { url: string; alt: string; isPrimary: boolean }[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

// Inventory alert
export interface InventoryAlert {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  threshold: number;
  status: "LOW_STOCK" | "OUT_OF_STOCK";
}

// Admin sidebar navigation
export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
