
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
  created_at: string;
  updated_at: string;
  company_id: string;
  
  // Make these fields optional for compatibility with mock data
  policy_type?: string;
  client_id?: string;
  insurer_id?: string;
  insured_id?: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  payment_frequency?: string;
  commission_type?: string;
  commission_amount?: number;
  commission_percentage?: number;
  notes?: string;
  assigned_to?: string;
  created_by?: string;
  
  // Aliases for compatibility
  client_name?: string;
  premium_amount?: number;
}

export type WorkflowStatus = 
  | 'imported'
  | 'in_review'
  | 'incomplete'
  | 'complete'
  | 'expired'
  | 'cancelled'
  | 'all';

export type PolicyStatus =
  | 'active'
  | 'pending'
  | 'expired'
  | 'cancelled'
  | 'all';

export type PolicyType =
  | 'life'
  | 'non-life'
  | 'health'
  | 'property'
  | 'vehicle'
  | 'liability'
  | 'travel'
  | 'other';

export interface PolicyAddendum {
  id: string;
  addendum_number: string;
  policy_id: string;
  effective_date: string;
  description: string;
  premium_adjustment?: number;
  lien_status: boolean;
  status: string;
  workflow_status: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  company_id: string;
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

export interface PolicyImportReviewProps {
  policies: Partial<Policy>[];
  invalidPolicies: { policy: Partial<Policy>; errors: string[]; }[];
}

export interface ValidationErrors {
  [index: string]: string[];
}
