
export enum ProposalStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  UNDER_REVIEW = 'under_review'
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
}

export interface SalesProcess {
  id: string;
  title: string;
  description?: string;
  stage: SaleStage;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  client_id?: string;
  expected_close_date?: string;
  estimated_value?: number;
  company_id: string;
  company?: string; // Additional field for company name
}
