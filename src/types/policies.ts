
export interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  start_date: string;
  expiry_date: string;
  policyholder_name: string;
  insured_name?: string;
  insurer_name: string;
  premium: number;
  currency: string;
  commission_type?: string;
  commission_percentage?: number;
  commission_amount?: number;
  status: string;
  workflow_status: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  client_id?: string;
  client_name?: string; // Added for compatibility with search dialogs
  insured_id?: string;
  insurer_id?: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  assigned_to?: string;
  created_by?: string;
  payment_frequency?: string;
  notes?: string; // Added for compatibility with policy forms
}

export interface ValidationErrors {
  [key: string]: string | string[];
}

export interface InvalidPolicy {
  policy?: Partial<Policy>;
  errors: string[] | any[];
  row?: any; // Added for compatibility
  data?: any; // Added based on error in usePolicyImport.ts
}

export interface PolicyImportProps {
  importedPolicies: Partial<Policy>[];
  invalidPolicies: InvalidPolicy[];
  validationErrors: ValidationErrors;
  handleFileSelect: (file: File) => Promise<void>;
  handleFileDrop: (acceptedFiles: File[]) => Promise<void>;
  isProcessing: boolean;
  isSubmitting: boolean;
  submitPolicies: () => Promise<boolean>;
  savePolicies?: () => Promise<boolean>;
  clearImportData?: () => void;
  isImporting?: boolean;
  isValidating?: boolean;
  importSuccess?: boolean;
}

// Convert WorkflowStatus from type to enum for use as values
export enum WorkflowStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  READY = 'ready',
  COMPLETE = 'complete',
  REVIEW = 'review',
  DRAFT = 'draft'
}

// Convert PolicyStatus from type to enum for use as values
export enum PolicyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
  CANCELLED = 'cancelled'
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
  created_at: string;
  updated_at: string;
  created_by?: string;
  company_id: string;
}

export interface UnlinkedPaymentType {
  id: string;
  amount: number;
  payment_date: string;
  reference?: string;
  payer_name?: string;
  status: string;
  currency: string;
  linked_policy_id?: string;
  linked_at?: string;
  linked_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyFilterParams {
  searchTerm?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  insurerId?: string;
  clientId?: string;
  assignedTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  workflowStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  sortDirection?: 'asc' | 'desc';
  productId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  expiryDateFrom?: string;
  expiryDateTo?: string;
}
