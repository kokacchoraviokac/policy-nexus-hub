// Enum for policy status
export enum PolicyStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  PENDING = "pending",
  CANCELLED = "cancelled",
  RENEWED = "renewed"
}

// Enum for policy workflow status
export enum PolicyWorkflowStatus {
  DRAFT = "draft",
  IN_REVIEW = "in_review",
  REVIEW = "review",
  READY = "ready",
  COMPLETE = "complete",
  FINALIZED = "finalized",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review",
  PENDING = "pending",
  PROCESSING = "processing"
}

// Alias WorkflowStatus to PolicyWorkflowStatus for backward compatibility
export const WorkflowStatus = PolicyWorkflowStatus;

// Type definitions for a policy
export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  start_date: string;
  expiry_date: string;
  client_id?: string;
  insurer_id?: string;
  product_id?: string;
  premium: number;
  currency: string;
  payment_frequency?: string;
  commission_type?: string;
  commission_percentage?: number;
  commission_amount?: number;
  status: string | PolicyStatus;
  workflow_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  created_by?: string;
  assigned_to?: string;
  policyholder_name: string;
  insurer_name: string;
  product_name?: string;
  insured_id?: string;
  insured_name?: string;
  product_code?: string;
  policy_type_id?: string;
  client_name?: string;
}

export interface PolicyFilterParams {
  page: number;
  page_size: number;
  search?: string;
  status?: string;
  workflow_status?: string;
  client_id?: string;
  insurer_id?: string;
  product_id?: string;
  assigned_to?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  start_date_from?: string;
  start_date_to?: string;
  expiry_from?: string;
  expiry_to?: string;
}

export interface ImportedPolicyData {
  policy_number: string;
  start_date: string;
  expiry_date: string;
  client_name: string;
  insurer_name: string;
  premium: number;
  currency: string;
  policy_type: string;
  product_name?: string;
  insured_name?: string;
}

export interface InvalidPolicy {
  policy: Partial<Policy>;
  errors: any[];
}

export interface ValidationErrors {
  [key: string]: string[];
  general?: string[];
}

export interface PolicyAddendum {
  id: string;
  addendum_number: string;
  policy_id: string;
  description: string;
  effective_date: string;
  premium_adjustment?: number;
  lien_status: boolean;
  status: string;
  workflow_status: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  company_id: string;
}
