
export interface Policy {
  id: string;
  policy_number: string;
  policyholder_name: string;
  insurer_name: string;
  insured_name?: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  status: string;
  workflow_status: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  commission_percentage?: number;
  commission_amount?: number;
  client_id?: string;
  client_name?: string;
  product_id?: string;
  product_name?: string;
  created_by?: string;
  assigned_to?: string;
}

export interface PolicyFilterParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  clientId?: string;
  insurerId?: string;
  productId?: string;
  workflowStatus?: string;
  assignedTo?: string;
  startDateFrom?: string;
  startDateTo?: string;
  expiryDateFrom?: string;
  expiryDateTo?: string;
  search?: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}

export interface WorkflowPolicy {
  id: string;
  policyNumber: string;
  policyholder: string;
  insurer: string;
  startDate: string;
  expiryDate: string;
  premium: number;
  assignedTo?: string;
  status: string;
  workflowStatus: string;
  client?: string;
  product?: string;
}
