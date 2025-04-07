
export enum WorkflowStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  IN_REVIEW = "in_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  FINALIZED = "finalized"
}

export type PolicyWorkflowStatus = WorkflowStatus;

export interface InvalidPolicy {
  row?: number;
  fields: Record<string, string[]>;
  data?: any;
}

export interface ValidationErrors {
  [key: string]: string[];
}

export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  policy_type_id?: string;
  start_date: string;
  expiry_date: string;
  policyholder_name: string;
  insured_name?: string;
  client_id?: string;
  insured_id?: string;
  insurer_id?: string;
  insurer_name: string;
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
  status: string;
  workflow_status: string;
  notes?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}
