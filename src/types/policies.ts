
import { WorkflowStatus } from "./workflow";

export enum PolicyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  RENEWED = 'renewed'
}

// Re-export WorkflowStatus from workflow.ts
export { WorkflowStatus } from "./workflow";

export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  start_date: string;
  expiry_date: string;
  policyholder_name: string;
  insurer_name: string;
  insurer_id?: string;
  client_id?: string;
  client_name?: string;
  premium: number;
  currency: string;
  payment_frequency?: string;
  commission_type?: string;
  commission_percentage?: number;
  commission_amount?: number;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  insured_id?: string;
  insured_name?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  assigned_to?: string;
  company_id: string;
  status: PolicyStatus | string;
  workflow_status: WorkflowStatus | string;
  notes?: string;
}

export interface PolicyAddendum {
  id: string;
  addendum_number: string;
  effective_date: string;
  description: string;
  premium_adjustment?: number;
  lien_status?: boolean;
  status: string;
  workflow_status: string;
  policy_id: string;
  created_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface UnlinkedPayment {
  id: string;
  amount: number;
  payment_date: string;
  reference?: string;
  status: string;
  payer_name?: string;
  currency: string;
  company_id: string;
  linked_at?: string;
  linked_by?: string;
  linked_policy_id?: string;
  created_at: string;
  updated_at: string;
}

export type UnlinkedPaymentType = UnlinkedPayment;

export interface InvalidPolicy {
  policy?: Partial<Policy>;
  errors: string[];
}

export interface ValidationErrors {
  [key: string]: string[];
}
