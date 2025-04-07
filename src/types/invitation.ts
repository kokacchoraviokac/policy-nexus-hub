
import { UserRole } from "@/types/auth/userTypes";

export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  EXPIRED = "expired",
  CANCELLED = "cancelled"
}

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  status: InvitationStatus;
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
  company_id?: string;
}

export interface InvitationEmailRequest {
  to: string;
  invitationToken: string;
  role: string;
  expiresAt: string;
}
