
export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type WorkflowStatus = 'draft' | 'review' | 'complete' | 'incomplete';
export type PolicyType = 'life' | 'non_life' | 'property' | 'auto' | 'health' | 'liability' | 'other';
export type PaymentFrequency = 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'one_time';
export type CommissionType = 'automatic' | 'manual';

export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string; 
  policy_type_id?: string;
  client_id?: string;
  client_name?: string; // Added this property
  insured_id?: string;
  insured_name?: string;
  insurer_id?: string;
  insurer_name: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  payment_frequency?: PaymentFrequency;
  commission_type?: CommissionType;
  commission_percentage?: number;
  commission_amount?: number;
  status: PolicyStatus;
  workflow_status: WorkflowStatus;
  policyholder_name: string;
  notes?: string;
  assigned_to?: string;
  created_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface PolicySearchParams {
  searchTerm?: string;
  client_id?: string;
  insurer_id?: string;
  status?: PolicyStatus;
  policy_type?: string;
  start_date_from?: string;
  start_date_to?: string;
  expiry_date_from?: string;
  expiry_date_to?: string;
  workflow_status?: WorkflowStatus;
}

export interface PolicyListItem {
  id: string;
  policy_number: string;
  client_name: string;
  insurer_name: string;
  product_name?: string;
  status: PolicyStatus;
  premium: number;
  currency: string;
  start_date: string;
  expiry_date: string;
  workflow_status: WorkflowStatus;
}

export interface ValidationErrors {
  [key: string]: string[];
}
