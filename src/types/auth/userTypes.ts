
import { UserRole } from "../common";

export { UserRole };

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  avatar?: string;
  role: UserRole;
  company_id?: string;
  companyId?: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  expires_at: string;
  status: "pending" | "accepted" | "expired";
  company_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvitationRequest {
  email: string;
  role: UserRole;
  company_id?: string;
  expiry_days?: number;
}

export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  granted_by: string;
  expires_at?: string | null;
  context?: string;
}
