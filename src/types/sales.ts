
import { ProposalStatus } from './reports';

export interface SalesProcess {
  id: string;
  title: string;
  company?: string;
  stage: SaleStage;
  estimatedValue?: number;
  expectedCloseDate?: string;
  assignedTo?: string;
  assignedName?: string;
  notes?: string;
  status: SalesProcessStatus;
  client_name?: string;
}

export type SaleStage = 
  | 'discovery'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'closing'
  | 'won'
  | 'lost';

export type SalesProcessStatus = 
  | 'active'
  | 'won'
  | 'lost'
  | 'on_hold'
  | 'cancelled';

export interface Quote {
  id: string;
  title: string;
  insurer: string;
  amount: number;
  currency: string;
  expiryDate: string;
  status: QuoteStatus;
  isSelected?: boolean;
}

export type QuoteStatus = 
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired';

// Export ProposalStatus as enum for use in components
export enum ProposalStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  APPROVED = 'approved',
  PENDING = 'pending',
  EXPIRED = 'expired'
}

// For backward compatibility
export type { Proposal } from './reports';

// Add any sales-specific extensions to Proposal here
export interface SalesProposal extends Proposal {
  // Additional sales-specific properties if needed
}

// Export ProposalStats interface
export interface ProposalStats {
  total: number;
  draft: number;
  sent: number;
  accepted: number;
  rejected: number;
  expired: number;
  pending: number;
  viewed: number;
  approved: number;
}

// Export UseProposalsDataProps interface
export interface UseProposalsDataProps {
  salesProcessId?: string;
  searchQuery?: string;
  statusFilter?: string | ProposalStatus;
}

export interface SalesFilters {
  searchTerm?: string;
  stage?: SaleStage | 'all';
  assignedTo?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  status?: SalesProcessStatus | 'all';
}
