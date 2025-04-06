
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
  policy_type?: string;
  payment_frequency?: string;
  commission_type?: string;
  notes?: string;
  insurer_id?: string;
  insured_id?: string;
  product_code?: string;
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

export interface WorkflowPolicy extends Policy {
  policyNumber?: string;
  policyholder?: string;
  insurer?: string;
  startDate?: string;
  expiryDate?: string;
  endDate?: string;
  client?: string;
  product?: string;
}

export interface PolicyAddendum {
  id: string;
  addendum_number: string;
  policy_id: string;
  description: string;
  effective_date: string;
  premium_adjustment?: number;
  status: string;
  workflow_status: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  created_by?: string;
  lien_status: boolean; // Changed from optional to required
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
  linked_at?: string;
  linked_by?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export enum PolicyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending'
}

export enum WorkflowStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  READY = 'ready',
  COMPLETE = 'complete',
  REJECTED = 'rejected'
}

// Add export for interface used in policy import
export interface InvalidPolicy {
  policy: Partial<Policy>;
  errors: string[];
}
