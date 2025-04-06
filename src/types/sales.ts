
import { DocumentCategory, EntityType } from "@/types/common";

export interface SalesProcess {
  id: string;
  sales_number?: string;
  company_id: string;
  client_id?: string;
  client_name?: string;
  current_step: string;
  status: string;
  estimated_value?: number;
  expected_close_date?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  assignee_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  title?: string;
  stage?: string;
  insurance_type?: string;
}

export enum ProposalStatus {
  DRAFT = "draft",
  SENT = "sent",
  VIEWED = "viewed",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  APPROVED = "approved",
  PENDING = "pending",
  EXPIRED = "expired"
}

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  client_id?: string;
  client_name: string;
  estimated_value: number;
  currency: string;
  status: ProposalStatus;
  expiry_date: string;
  document_url?: string;
  created_at: string;
  updated_at?: string;
  created_by: string;
  sales_process_id?: string;
  insurer_name?: string;
  coverage_details?: string;
  premium?: number;
  notes?: string;
  document_ids?: string[];
  sent_at?: string;
  viewed_at?: string;
  expires_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  amount?: number;
}

export interface ProposalStats {
  draft: number;
  sent: number;
  accepted: number;
  rejected: number;
  expired: number;
  viewed: number;
  pending: number;
  approved: number;
  total: number;
  totalCount?: number;
  pendingCount?: number;
  approvedCount?: number;
  rejectedCount?: number;
}

export interface SalesLeadFormValues {
  name: string;
  company_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  source?: string;
  notes?: string;
}

export interface SalesProcessFormValues {
  client_id?: string;
  client_name?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  estimated_value?: number;
  expected_close_date?: string;
  status?: string;
  current_step?: string;
  notes?: string;
  assigned_to?: string;
}

// Document type for sales processes
export interface SalesDocument {
  id: string;
  name: string;
  file_type: string;
  file_path: string;
  uploaded_by: string;
  uploaded_at: string;
  category: DocumentCategory;
  stage: string;
  size: number;
}

// Stages for a sales process
export enum SalesStage {
  PROSPECTING = "prospecting",
  QUALIFICATION = "qualification",
  NEEDS_ANALYSIS = "needs_analysis",
  PROPOSAL = "proposal",
  NEGOTIATION = "negotiation",
  CLOSING = "closing",
  LOST = "lost",
  WON = "won"
}

// Steps for quote management
export enum QuoteStep {
  QUOTE_REQUEST = "quote_request",
  INSURER_QUOTES = "insurer_quotes",
  CLIENT_REVIEW = "client_review",
  SELECTED_QUOTE = "selected_quote",
  POLICY_IMPORTED = "policy_imported"
}

// Types of team member assignments
export enum AssignmentRole {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SUPPORT = "support",
  SPECIALIST = "specialist"
}

// Define interface for useProposalsData hook props
export interface UseProposalsDataProps {
  sales_process_id?: string;
  status?: string;
  searchQuery?: string;
  statusFilter?: string;
}
