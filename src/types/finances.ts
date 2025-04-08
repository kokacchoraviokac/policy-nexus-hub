
// Commission Type
export interface CommissionType {
  id: string;
  policy_id: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  paid_amount: number;
  payment_date: string;
  status: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

// Unlinked Payment Type
export interface UnlinkedPaymentType {
  id: string;
  reference?: string;
  payer_name?: string;
  amount: number;
  payment_date: string;
  status: 'linked' | 'unlinked';
  policy_id?: string;
  created_at: string;
  company_id: string;
  currency: string;
  linked_policy_id?: string;
  linked_by?: string;
  linked_at?: string;
}

export interface InvoiceType {
  id: string;
  invoice_number: string;
  entity_type: string;
  entity_name: string;
  entity_id?: string;
  issue_date: string;
  due_date: string;
  currency: string;
  total_amount: number;
  notes?: string;
  status: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  invoice_type?: string;
  invoice_category?: string;
  calculation_reference?: string;
  entity?: {
    name: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

export interface InvoiceItem {
  id?: string;
  invoice_id: string;
  description: string;
  amount: number;
  policy_id?: string;
  commission_id?: string;
  policy?: {
    policy_number: string;
    policyholder_name: string;
  };
  commission?: {
    policy_id: string;
    calculated_amount: number;
  };
}

export interface InvoiceTemplateSettings {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  font_size: string;
  font_weight?: 'normal' | 'bold' | 'light';
  font_style?: 'normal' | 'italic';
  logo_position: 'left' | 'center' | 'right';
  header_text: string;
  footer_text: string;
  payment_instructions: string;
  show_payment_instructions?: boolean;
  is_default: boolean;
}

// Bank Statement Types
export interface BankStatement {
  id: string;
  statement_date: string;
  bank_name: string;
  account_number: string;
  starting_balance: number;
  ending_balance: number;
  status: 'in_progress' | 'processed' | 'confirmed';
  file_path?: string;
  processed_by?: string;
  processed_at?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  id: string;
  statement_id: string;
  transaction_date: string;
  description: string;
  reference?: string;
  amount: number;
  status: 'unmatched' | 'matched' | 'ignored';
  matched_policy_id?: string;
  matched_invoice_id?: string;
  matched_by?: string;
  matched_at?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}
