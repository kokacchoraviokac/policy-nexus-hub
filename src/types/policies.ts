
export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  insurer_id: string;
  insurer_name: string;
  product_id: string | null;
  product_name: string | null;
  client_id: string;
  policyholder_name: string;
  insured_id: string | null;
  insured_name: string | null;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  payment_frequency: string | null;
  commission_type: string | null;
  commission_percentage: number | null;
  commission_amount: number | null;
  status: string;
  workflow_status: string;
  notes: string | null;
  company_id: string;
  created_by: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface PolicyAddendum {
  id: string;
  addendum_number: string;
  effective_date: string;
  description: string;
  premium_adjustment?: number;
  lien_status: boolean; // Changed from optional to required
  status: string;
  workflow_status: string;
  policy_id: string;
  company_id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface UnlinkedPaymentType {
  id: string;
  amount: number;
  payment_date: string;
  payer_name?: string;
  reference?: string;
  status: string;
  currency: string;
  linked_policy_id?: string;
  linked_by?: string;
  linked_at?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyFilterParams {
  page?: number; 
  pageSize?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  workflowStatus?: string;
  status?: string;
  client_id?: string;
  insurer_id?: string;
  date_from?: string;
  date_to?: string;
  expiry_from?: string;
  expiry_to?: string;
}
