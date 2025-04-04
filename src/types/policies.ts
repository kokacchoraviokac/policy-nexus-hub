
export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  client_id: string;
  insured_id?: string;
  insurer_id?: string;
  insurer_name: string;
  product_id?: string;
  product_name?: string;
  status: string;
  workflow_status: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  created_by?: string;
  assigned_to?: string;
  notes?: string;
  commission_percentage?: number;
  commission_amount?: number;
  commission_type?: string;
  payment_frequency?: string;
  policyholder_name: string;
  insured_name?: string;
}

export interface PolicyAddendum {
  id: string;
  policy_id: string;
  addendum_number: string;
  description: string;
  effective_date: string;
  premium_adjustment?: number;
  status: string;
  workflow_status: string;
  lien_status?: boolean;
  created_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface UnlinkedPaymentType {
  id: string;
  amount: number;
  currency: string;
  payment_date: string;
  payer_name?: string;
  reference?: string;
  status: string;
  linked_policy_id?: string;
  linked_at?: string;
  linked_by?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface PolicyFilterParams {
  status?: string;
  workflow_status?: string;
  insurer_id?: string;
  client_id?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
  searchTerm?: string;
}
