
export type SalesProcessStage = 
  | "discovery"
  | "quote"
  | "proposal"
  | "contract"
  | "closeout";

export interface SalesProcess {
  id: string;
  lead_id?: string;
  company_id: string;
  sales_number?: string;
  current_step: SalesProcessStage;
  status: string;
  assigned_to?: string;
  expected_close_date?: string;
  estimated_value?: number;
  created_at: string;
  updated_at: string;
  company?: string;
  title?: string;
  stage?: SalesProcessStage;
}

export type ProposalStatus = 
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired";

export interface Proposal {
  id: string;
  title: string;
  sales_process_id?: string;
  client_id?: string;
  client_name: string;
  description?: string;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  viewed_at?: string;
  sent_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  total_value?: number;
  currency?: string;
  created_by: string;
  company_id: string;
  template_id?: string;
  document_ids?: string[];
  // Optional fields for UI display
  notes?: string;
  premium?: string;
  coverage_details?: string;
  insurer_name?: string;
}

export interface UseProposalsDataProps {
  salesProcessId?: string;
  clientName?: string;
  searchQuery?: string;
  statusFilter?: string;
}
