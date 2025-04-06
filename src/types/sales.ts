
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

// Export ProposalStatus for use in components
export { ProposalStatus } from './reports';

// Use the Proposal interface from reports for consistency
export { Proposal } from './reports';

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
}

// Export UseProposalsDataProps interface
export interface UseProposalsDataProps {
  clientId?: string;
  salesProcessId?: string;
  status?: ProposalStatus;
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
