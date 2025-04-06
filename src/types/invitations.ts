
import { UserRole } from "./auth/userTypes";

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface Invitation {
  id: string;
  token: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  company_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
}
