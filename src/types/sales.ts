
import { DocumentCategory } from '@/types/common';

// Define the Proposal Status enum
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

// Define the Proposal interface
export interface Proposal {
  id: string;
  title: string;
  description?: string;
  client_id: string;
  client_name: string;
  sales_process_id?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  status: ProposalStatus;
  amount: number;
  currency?: string;
  expiry_date?: string;
  document_ids?: string[];
  insurer_id?: string;
  insurer_name?: string;
  coverage_details?: string;
  premium?: number;
  notes?: string;
  sent_at?: string;
  viewed_at?: string;
  expires_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  company_id: string;
}

// Define the SalesProcess interface
export interface SalesProcess {
  id: string;
  title: string;
  stage: string;
  client_id: string;
  client_name: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  insurance_type: string;
  estimated_value?: number;
  expected_close_date?: string;
  assigned_to?: string;
  current_step: string;
  status: "active" | "closed" | "lost";
  product_id?: string;
  insurer_id?: string;
}

// Define the ProposalStats interface
export interface ProposalStats {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  expired: number;
  total: number;
  pending: number;
  sent: number;
  viewed: number;
  accepted: number;
  rejected: number;
  approved: number;
  draft: number;
}

// Define the UseProposalsDataProps interface
export interface UseProposalsDataProps {
  client_id?: string;
  sales_process_id?: string;
  status?: ProposalStatus | 'all';
  limit?: number;
}

// Define SalesProcessDocumentsProps
export interface SalesProcessDocumentsProps {
  process: SalesProcess;
  salesStage?: string;
}
