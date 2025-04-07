
import { UserRole } from "../common";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
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
