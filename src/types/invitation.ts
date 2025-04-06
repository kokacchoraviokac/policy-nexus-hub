
import { UserRole } from "./auth/userTypes";

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
  created_by: string | null;
  company_id: string | null;
  updated_at: string;
}

export interface InvitationCreateParams {
  email: string;
  role: UserRole;
  expires_in_days?: number;
}

export interface AcceptInvitationParams {
  token: string;
  name: string;
  password: string;
}

export interface CreateInvitationRequest {
  email: string;
  role: UserRole;
  company_id?: string;
}
