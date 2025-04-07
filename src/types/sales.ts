
import { DocumentCategory, EntityType } from "./common";

export enum ProposalStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SENT = "sent",
  VIEWED = "viewed",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  APPROVED = "approved",   // Added APPROVED status
  EXPIRED = "expired"
}

export enum SalesProcessStage {
  QUOTE = "quote",
  AUTHORIZATION = "authorization",
  PROPOSAL = "proposal",
  SIGNED = "signed",
  CONCLUDED = "concluded"
}

export interface SalesProcess {
  id: string;
  sales_number?: string;
  client_id?: string;
  client_name?: string;
  assigned_to?: string;
  current_step: SalesProcessStage | string;
  status: string;
  estimated_value?: number;
  expected_close_date?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  lead_id?: string;
}

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  client_id: string;
  client_name: string;
  insurer_id: string;
  insurer_name: string;
  sales_process_id?: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  status: ProposalStatus;
  created_by: string;
  company_id: string;
  premium?: number;
  notes?: string;
  sent_at?: string;
  viewed_at?: string;
  expires_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  expiry_date?: string;
  is_latest?: boolean;
  coverage_details?: string;
  document_ids?: string[];
}

export interface CreateProposalRequest {
  title: string;
  description: string;
  client_id: string;
  insurer_id: string;
  sales_process_id: string;
  amount: number;
  currency: string;
  status: ProposalStatus;
  premium?: number;
  notes?: string;
  expires_at?: string;
  coverage_details?: string;
}

export interface ProposalStats {
  total: number;
  draft: number;
  pending: number;
  sent: number;
  viewed: number;
  accepted: number;
  rejected: number;
  approved: number; // Added approved count
  expired: number;
}

export interface UseProposalsDataProps {
  salesProcessId?: string;
  filter?: string;
  initialLimit?: number;
  searchQuery?: string; // Added searchQuery
  statusFilter?: string; // Added statusFilter
}

// Added DocumentsTabProps interface
export interface DocumentsTabProps {
  salesProcess: SalesProcess;
  salesStage?: string;
}
