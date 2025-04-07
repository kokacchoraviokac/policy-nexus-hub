
export enum ProposalStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SENT = 'sent',
  VIEWED = 'viewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  APPROVED = 'approved',
  EXPIRED = 'expired'
}

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  client_id: string;
  client_name: string;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  amount: number;
  currency: string;
  sales_process_id?: string;
  created_by: string;
  document_id?: string;
  company_id: string;
  insurer_id: string;
  insurer_name: string;
  premium?: number;
  notes?: string;
  sent_at?: string;
  viewed_at?: string;
  expires_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  coverage_details?: string;
  is_latest?: boolean;
}

export interface ProposalStats {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  total: number;
  accepted: number;
  rejected: number;
  draft: number;
  pending: number;
  sent: number;
  viewed: number;
  approved: number;
  expired: number;
}

export interface ProposalsListProps {
  proposals: Proposal[];
  onStatusChange?: (proposalId: string, newStatus: ProposalStatus) => Promise<boolean>;
}

export interface UseProposalsDataProps {
  sales_process_id?: string;
  searchQuery?: string;
  statusFilter?: string;
}

export interface UpdateProposalStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: ProposalStatus;
  onUpdate: (status: ProposalStatus) => Promise<void>;
}
