
export interface Policy {
  id: string;
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
  premium: number;
  currency: string;
  payment_frequency?: string;
  commission_type?: string;
  commission_percentage?: number;
  commission_amount?: number;
  status: string;
  workflow_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  assigned_to?: string;
  company_id: string;
  documents_count?: number;
  claims_count?: number;
  addendums_count?: number;
}

export interface PolicyAddendum {
  id: string;
  policy_id: string;
  addendum_number: string;
  effective_date: string;
  description: string;
  premium_adjustment?: number;
  lien_status: boolean;
  status: string;
  workflow_status: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  company_id: string;
}

export interface PolicyStatistic {
  label: string;
  count: number;
  icon?: React.ReactNode;
}
