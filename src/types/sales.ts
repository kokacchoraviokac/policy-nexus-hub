
import { BaseEntity, EntityType, DocumentCategory } from "./common";

export interface Lead extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  contact_person?: string;
  source?: string;
  status: LeadStatus;
  notes?: string;
  assigned_to?: string;
  company?: string; // For backward compatibility
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
  DORMANT = 'dormant',
  CONVERTED = 'converted'
}

export interface SalesProcess extends BaseEntity {
  lead_id?: string;
  sales_number?: string;
  estimated_value?: number;
  expected_close_date?: string;
  status: SalesProcessStatus;
  assigned_to?: string;
  current_step: string;
  client_name?: string; // Added for backward compatibility
  updated_at: string; // Ensure this property exists
}

export enum SalesProcessStatus {
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ProposalStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  PENDING = 'pending', // Added missing status
  VIEWED = 'viewed',   // Added missing status
  APPROVED = 'approved' // Added missing status
}

export interface Proposal extends BaseEntity {
  title: string;
  client_id: string;
  client_name: string;
  sales_process_id: string;
  insurer_id: string;
  insurer_name: string;
  coverage_details: string;
  premium: number;
  currency: string;
  valid_until: string;
  status: ProposalStatus;
  notes?: string;
  description?: string; // Added for backward compatibility
  document_ids?: string[]; // Added for backward compatibility
  sent_at?: string; // Added for backward compatibility
  viewed_at?: string; // Added for backward compatibility
  expires_at?: string; // Added for backward compatibility
  amount?: number; // Added for backward compatibility
  expiry_date?: string; // Added for backward compatibility
}

// Interface for useProposalsData hook
export interface UseProposalsDataProps {
  salesProcessId?: string;
  clientId?: string;
  status?: ProposalStatus;
  pageSize?: number;
  initialPage?: number;
}

// Interface for proposal statistics
export interface ProposalStats {
  total: number;
  pending: number;
  viewed: number;
  accepted: number;
  rejected: number;
  expired: number;
}
