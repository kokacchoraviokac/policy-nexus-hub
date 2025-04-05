
// Define policy types
import { UserRole } from "./auth";
import { Insurer } from "./insurers";
import { ClientInfo } from "./clients";

export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type PolicyType = 'life' | 'non-life';
export type WorkflowStatus = 'draft' | 'in_review' | 'ready' | 'complete';
export type PaymentFrequency = 'one_time' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
export type CommissionType = 'automatic' | 'manual' | 'none';

export interface Policy {
  id: string;
  company_id: string;
  policy_number: string;
  policy_type: PolicyType;
  policyholder_name: string;
  insurer_name: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  status: PolicyStatus;
  workflow_status: WorkflowStatus;
  commission_percentage?: number;
  commission_amount?: number;
  commission_type?: CommissionType;
  created_at: string;
  updated_at: string;
  created_by?: string;
  assigned_to?: string;
  client_id?: string;
  insured_id?: string;
  insurer_id?: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  insured_name?: string;
  payment_frequency?: PaymentFrequency;
  notes?: string;
}

export interface PolicyAddendum {
  id: string;
  addendum_number: string;
  effective_date: string;
  description: string;
  premium_adjustment?: number;
  lien_status?: boolean;
  status: string;
  workflow_status: string;
  policy_id: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  company_id: string;
}

export interface UnlinkedPaymentType {
  id: string;
  amount: number;
  payment_date: string;
  payer_name?: string;
  reference?: string;
  currency: string;
  status: string;
  linked_policy_id?: string;
  linked_at?: string;
  linked_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyNote {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  created_by_name?: string;
  policy_id: string;
}

export interface PolicyFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PolicyStatus[];
  workflowStatus?: WorkflowStatus[];
  insurerId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  assignedToMe?: boolean;
  expiringSoon?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ValidationErrors {
  [key: string]: string[];
}
