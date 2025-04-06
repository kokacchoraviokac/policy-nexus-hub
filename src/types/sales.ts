
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
  | 'quote'
  | 'proposal'
  | 'negotiation'
  | 'closing'
  | 'won'
  | 'lost'
  | 'authorization'; // Added missing stage

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
  EXPIRED = 'expired',
  WITHDRAWN = 'withdrawn',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed'
}

export interface Proposal {
  id: string;
  title: string;
  client_name: string;
  client_id?: string;
  insurer_id?: string;
  insurer_name?: string;
  sales_process_id?: string;
  description?: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  status: ProposalStatus;
  expiry_date?: string;
  valid_until?: string;
  version?: number;
  is_latest?: boolean;
  coverage_details?: string;
  premium?: number;
  notes?: string;
  document_ids?: string[];
  sent_at?: string;
  viewed_at?: string;
  expires_at?: string;
  accepted_at?: string;
  rejected_at?: string;
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

// Interface for ProposalsListProps
export interface ProposalsListProps {
  proposals: Proposal[];
  onStatusChange?: (proposalId: string, newStatus: ProposalStatus) => Promise<boolean>;
}

// Interface for UpdateProposalStatusDialogProps
export interface UpdateProposalStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (status: ProposalStatus) => Promise<void>;
  currentStatus: ProposalStatus;
}

// Interface for DocumentsTabProps
export interface DocumentsTabProps {
  process?: SalesProcess;
}
