
import { EntityType } from "./common";

export interface Policy {
  id: string;
  policy_number: string;
  policyholder_name: string;
  insurer_name: string;
  insured_name?: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency?: string;
  policy_type: string;
  payment_frequency?: string;
  commission_type?: string;
  commission_percentage?: number;
  commission_amount?: number;
  status: string;
  notes?: string;
  assigned_to?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  product_name?: string;
  product_code?: string;
  client_id?: string;
  insured_id?: string;
  insurer_id?: string;
  product_id?: string;
  workflow_status?: string;
  client_name?: string;
}

export interface WorkflowPolicy extends Policy {
  workflow_status: string;
}

export interface PolicyAddendum {
  id: string;
  policy_id: string;
  addendum_number: string;
  description: string;
  effective_date: string;
  premium_adjustment?: number;
  status: string;
  workflow_status: string;
  lien_status: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface PolicyImportReviewProps {
  policies: Partial<Policy>[];
  invalidPolicies: InvalidPolicy[];
  onSubmit?: () => Promise<void>;
  isSubmitting?: boolean;
  errors?: ValidationErrors;
  validationErrors?: ValidationErrors;
  onBack?: () => void;
  onImport?: () => void;
}

export interface PolicyImportInstructionsProps {
  className?: string;
}

export interface InvalidPolicy {
  row: number;
  errors: string[];
  data: Partial<Policy>;
  policy?: Partial<Policy>;
}

export interface ValidationErrors {
  [key: string]: string[];
}

export interface FilterBarProps {
  children?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: React.Dispatch<React.SetStateAction<string>>;
  searchPlaceholder?: string;
  className?: string;
}

// Define WorkflowStatus as an enum to be used as a value
export enum WorkflowStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  READY = 'ready',
  COMPLETE = 'complete',
  REVIEW = 'review',
  REJECTED = 'rejected'
}

// Define PolicyStatus as an enum to be used as a value
export enum PolicyStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface PolicyFilterParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  workflowStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  // Additional fields
  clientId?: string;
  insurerId?: string;
  productId?: string;
  assignedTo?: string;
  startDateFrom?: string;
  startDateTo?: string;
  expiryDateFrom?: string;
  expiryDateTo?: string;
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
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowPoliciesListProps {
  policies: Policy[];
  isLoading: boolean;
  onReviewPolicy?: (policyId: string) => void;
  error?: Error | null;
  isError?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  workflowStatus?: string;
  onStatusChange?: (status: string) => void;
}
