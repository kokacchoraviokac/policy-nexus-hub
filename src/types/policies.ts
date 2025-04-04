
export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  start_date: string;
  expiry_date: string;
  status: string;
  workflow_status: string;
  notes?: string;
  client_id?: string;
  policyholder_name: string;
  insurer_id?: string;
  insurer_name: string;
  insured_id?: string;
  insured_name?: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  premium: number;
  currency: string;
  payment_frequency?: string;
  commission_type?: string;
  commission_percentage?: number;
  commission_amount?: number;
  assigned_to?: string;
  created_by?: string;
  company_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface PolicyFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  workflowStatus?: string;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  insurerId?: string;
  assignedTo?: string;
}

export type WorkflowStatus = 'draft' | 'in_review' | 'ready' | 'complete';
