
import { UserRole } from "./auth/userTypes";

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  company_id: string | null;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired'
}

export interface CreateInvitationRequest {
  email: string;
  role: UserRole;
  company_id?: string;
  expiry_days?: number;
}

export type Column<T> = {
  accessorKey?: string;
  header?: string | React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  enableSorting?: boolean;
};
