
export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  policyholder_name: string;
  insurer_name: string;
  insured_name?: string;
  product_name?: string;
  product_code?: string;
  product_id?: string;
  client_id?: string;
  insurer_id?: string;
  insured_id?: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  payment_frequency?: string;
  status: string;
  workflow_status: string;
  commission_percentage?: number;
  commission_amount?: number;
  commission_type?: string;
  notes?: string;
  assigned_to?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface PolicyAddendum {
  id: string;
  addendum_number: string;
  policy_id: string;
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

export interface PolicyDocument {
  id: string;
  policy_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  version: number;
  is_latest_version: boolean;
  original_document_id?: string;
  category?: string;
  company_id: string;
  mime_type?: string;
}
