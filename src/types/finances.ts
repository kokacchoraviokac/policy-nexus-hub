
export interface Commission {
  id: string;
  policy_id: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  paid_amount?: number;
  payment_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface BankStatement {
  id: string;
  statement_date: string;
  bank_name: string;
  account_number: string;
  starting_balance: number;
  ending_balance: number;
  status: string;
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
  status: string;
  matched_policy_id?: string;
  matched_invoice_id?: string;
  matched_by?: string;
  matched_at?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceType {
  id: string;
  invoice_number: string;
  entity_type?: string;
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
  invoice_type?: 'domestic' | 'foreign';
  invoice_category?: 'automatic' | 'manual';
  calculation_reference?: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  amount: number;
  policy_id?: string;
  commission_id?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceTemplateSettings {
  id: string;
  name: string;
  company_id: string;
  is_default: boolean;
  logo_position: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  font_size: string;
  header_text?: string;
  footer_text?: string;
  payment_instructions?: string;
  created_at: string;
  updated_at: string;
}
