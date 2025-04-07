
// Update the sales types with additional needed fields

export enum ProposalStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  UNDER_REVIEW = 'under_review',
  SENT = 'sent',
  VIEWED = 'viewed',
  APPROVED = 'approved',
  INFO = 'info'
}

export enum SaleStage {
  INITIAL = 'initial',
  DISCOVERY = 'discovery',
  QUOTE = 'quote',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CONTRACT = 'contract',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
  IMPLEMENTATION = 'implementation',
  // Add SalesProcessStage values to SaleStage enum to fix compatibility
  SIGNED = 'signed',
  AUTHORIZATION = 'authorization'
}

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
  amount: number;
  sales_process_id: string;
  client_id?: string;
  insurer_id?: string;
  expiry_date?: string;
  created_by: string;
  company_id: string;
  // Additional fields needed by ProposalViewDialog
  client_name?: string;
  insurer_name?: string;
  coverage_details?: string;
  premium?: number | string;
  notes?: string;
  document_ids?: string[];
  sent_at?: string;
  viewed_at?: string;
  expires_at?: string;
  currency?: string;
  version?: number;
  is_latest?: boolean;
  accepted_at?: string;
  rejected_at?: string;
}

export interface SalesProcess {
  id: string;
  title: string;
  description?: string;
  stage: SaleStage;
  created_at: string;
  updated_at: string;
  company_id: string;
  assigned_to?: string;
  client_id?: string;
  expected_close_date?: string;
  estimated_value?: number;
  company?: string; // Additional field for company name
  client_name?: string;
}

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

export interface UseProposalsDataProps {
  salesProcessId?: string;
  searchQuery?: string;
  statusFilter?: string;
}

export interface ProposalsListProps {
  proposals: Proposal[];
  onStatusChange?: (proposalId: string, newStatus: ProposalStatus) => Promise<boolean>;
}

export interface UpdateProposalStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (status: ProposalStatus) => Promise<void>;
  currentStatus: ProposalStatus;
}
