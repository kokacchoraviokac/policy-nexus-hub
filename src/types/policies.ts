
// Define policy types
export type PolicyType = 'external' | 'internal' | string;
export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending' | string;
export type CommissionType = 'automatic' | 'manual' | 'none';
export type WorkflowStatus = 'draft' | 'in_review' | 'ready' | 'complete' | string;
export type PaymentFrequency = 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'full';

// Basic interfaces for related entities
export interface Insurer {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface PolicyAddendum {
  id: string;
  policy_id: string;
  addendum_number: string;
  effective_date: string;
  description: string;
  premium_adjustment?: number;
  lien_status?: boolean;
  status: string;
  workflow_status: string;
  created_at: string;
  created_by?: string;
  updated_at: string;
  company_id: string;
}

export interface Policy {
  id: string;
  company_id: string;
  policy_number: string;
  policy_type: PolicyType;
  policyholder_name: string;
  client_id?: string;
  client_name?: string;
  insurer_id?: string;
  insurer_name: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  premium_amount?: number;
  currency: string;
  payment_frequency?: PaymentFrequency;
  status: PolicyStatus;
  commission_type?: CommissionType;
  commission_percentage?: number;
  commission_amount?: number;
  assigned_to?: string;
  created_by?: string;
  insured_id?: string;
  insured_name?: string;
  workflow_status: WorkflowStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyFilterParams {
  client_id?: string;
  insurer_id?: string;
  product_id?: string;
  status?: PolicyStatus | string;
  workflow_status?: WorkflowStatus | string;
  assigned_to?: string;
  start_date_from?: string;
  start_date_to?: string;
  expiry_date_from?: string;
  expiry_date_to?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface UnlinkedPaymentType {
  id: string;
  amount: number;
  payment_date: string;
  reference?: string;
  payer_name?: string;
  status: string;
  linked_policy_id?: string;
  linked_at?: string;
  linked_by?: string;
  currency: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}
