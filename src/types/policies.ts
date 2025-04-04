
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
