
export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type WorkflowStatus = 'draft' | 'in_review' | 'ready' | 'completed' | 'rejected';
export type PaymentFrequency = 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'one_time';
export type CommissionType = 'fixed' | 'percentage' | 'manual' | 'none';

export interface Policy {
  id: string;
  company_id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  
  policy_number: string;
  policy_type: string;
  
  insurer_id?: string;
  insurer_name: string;
  
  product_id?: string;
  product_name?: string;
  product_code?: string;
  
  client_id?: string;
  policyholder_name: string;
  insured_id?: string;
  insured_name?: string;
  
  start_date: string;
  expiry_date: string;
  
  status: PolicyStatus;
  workflow_status: WorkflowStatus;
  
  premium: number;
  currency: string;
  payment_frequency: PaymentFrequency;
  
  commission_type?: CommissionType;
  commission_percentage?: number;
  commission_amount?: number;
  
  assigned_to?: string;
  notes?: string;

  // Added fields for compatibility with other component usage
  premium_amount?: number;
  client_name?: string;
}

export interface PolicyAddendum {
  id: string;
  policy_id: string;
  addendum_number: string;
  description: string;
  effective_date: string;
  premium_adjustment?: number;
  lien_status?: boolean;
  status: string;
  workflow_status: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface UnlinkedPaymentType {
  id: string;
  amount: number;
  payment_date: string;
  reference?: string;
  status: string;
  payer_name?: string;
  linked_at?: string;
  linked_by?: string;
  linked_policy_id?: string;
  currency: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyFilterParams {
  status?: PolicyStatus;
  workflowStatus?: WorkflowStatus;
  insurer_id?: string;
  client_id?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ValidationErrors {
  [key: string]: string[];
}
