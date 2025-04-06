
import { UserRole } from "./auth";

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
  status: InvitationStatus;
  token: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  created_by?: string;
  company_id?: string;
}

export interface InvitationFormData {
  email: string;
  role: UserRole;
  expiresIn: number; // days
}

export interface CreateInvitationRequest {
  email: string;
  role: UserRole;
  expiresIn: number;
  company_id?: string;
}
