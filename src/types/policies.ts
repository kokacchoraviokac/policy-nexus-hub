
import { WorkflowStatus } from "./common";

export { WorkflowStatus };

export type PolicyWorkflowStatus = WorkflowStatus;

export interface InvalidPolicy {
  row?: number;
  fields: Record<string, string[]>;
  data?: any;
  errors?: string[];
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
  client_name?: string; // Adding this since it's used in several components
}

export interface PolicyAddendum {
  id: string;
  policy_id: string;
  addendum_number: string;
  effective_date: string;
  description: string;
  premium_adjustment?: number;
  lien_status?: boolean;
  status: string;
  workflow_status: string;
  created_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyFilterParams {
  status?: string;
  expiry_from?: string;
  expiry_to?: string;
  client_id?: string;
  insurer_id?: string;
  workflow_status?: string;
  search?: string;
  start_date_from?: string;
  start_date_to?: string;
  premium_min?: number;
  premium_max?: number;
  assigned_to?: string;
  page?: number;
  limit?: number;
}

export enum PolicyStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  PENDING = "pending",
  CANCELLED = "cancelled"
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
  linked_by?: string;
  linked_at?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}
