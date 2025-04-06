
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

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
  client_id: string;
  client_name: string;
  amount: number;
  currency: string;
  sales_process_id: string;
  created_by?: string;
  company_id?: string;
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
