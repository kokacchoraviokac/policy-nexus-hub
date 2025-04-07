
import { UserRole } from "@/types/auth/userTypes";

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  status: "pending" | "accepted" | "expired";
  expires_at: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  company_id: string | null;
}

export interface CreateInvitationRequest {
  email: string;
  role: UserRole;
  expires_at?: string;
  expiry_days?: number;
}

export interface InvitationEmailRequest {
  to: string;
  invitationToken: string;
  role: string;
  expiresAt: string;
}
