
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
  insured_id?: string;
  insurer_id?: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  assigned_to?: string;
  created_by?: string;
  payment_frequency?: string;
}

export interface ValidationErrors {
  [key: string]: string | string[];
}

export interface InvalidPolicy {
  policy?: Partial<Policy>;
  errors: string[] | any[];
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
