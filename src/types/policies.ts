
export enum PolicyWorkflowStatus {
  DRAFT = "draft",
  IN_REVIEW = "in_review",
  READY = "ready",
  COMPLETE = "complete",
  REJECTED = "rejected"
}

export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  policyholder_name: string;
  status: string;
  workflow_status: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  client_id?: string;
  insurer_id?: string;
  insurer_name: string;
  insured_id?: string;
  insured_name?: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  assigned_to?: string;
  created_by?: string;
  commission_type?: string;
  commission_percentage?: number;
  commission_amount?: number;
  payment_frequency?: string;
  policy_type_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface PolicyAddendum {
  id: string;
  addendum_number: string;
  policy_id: string;
  effective_date: string;
  description: string;
  premium_adjustment?: number;
  lien_status?: boolean;
  status: string;
  workflow_status: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface InvalidPolicy {
  row: number;
  data: Partial<Policy>;
  errors: string[];
  fields: Record<string, string>;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface PolicyFilterParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  workflow_status?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  client_id?: string;
  insurer_id?: string;
  product_id?: string;
  assigned_to?: string;
  start_date_from?: string;
  start_date_to?: string;
  expiry_from?: string;
  expiry_to?: string;
}
