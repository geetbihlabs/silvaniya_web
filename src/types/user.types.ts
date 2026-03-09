// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  avatar?: string;
  memberSince: string;
  membershipTier?: "SILVER" | "GOLD" | "PLATINUM";
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  lastLogin?: string;
  is2faEnabled: boolean;
}

export type AdminRole = "SUPER_ADMIN" | "STORE_MANAGER" | "SUPPORT_AGENT";
