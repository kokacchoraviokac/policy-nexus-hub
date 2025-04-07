
export interface Policy {
  id: string;
  policy_number: string;
  insurer_id: string;
  insurer_name: string;
  client_id: string;
  premium: number;
  currency: string;
  start_date: string;
  expiry_date: string;
  status: string;
  workflow_status: string;
  policy_type: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  company_id: string;
  assigned_to?: string;
  commission_type?: string;
  commission_percentage?: number;
  commission_amount?: number;
  payment_frequency?: string;
  policyholder_name: string;
  insured_name?: string;
  insured_id?: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  notes?: string;
}

export interface InvalidPolicy {
  errors: string[];
  row_number?: number;
  data?: Partial<Policy>;
}

export interface ValidationErrors {
  global?: string[];
  byRow?: Record<number, string[]>;
}
