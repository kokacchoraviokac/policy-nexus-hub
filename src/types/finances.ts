
export interface BankStatement {
  id: string;
  statement_number?: string;
  statement_date: string;
  bank_name: string;
  account_number: string;
  starting_balance: number;
  ending_balance: number;
  status: 'in_progress' | 'processed' | 'confirmed';
  processed_by?: string;
  processed_at?: string;
  file_path?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface BankTransaction {
  id: string;
  statement_id: string;
  transaction_date: string;
  description: string;
  amount: number;
  reference?: string;
  matched_policy_id?: string;
  matched_invoice_id?: string;
  status: 'unmatched' | 'matched' | 'ignored';
  matched_at?: string;
  matched_by?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface InvoiceType {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  currency: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  entity_id?: string;
  entity_type?: string;
  entity_name: string;
  company_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionType {
  id: string;
  policy_id: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  payment_date?: string;
  paid_amount?: number;
  status: 'due' | 'partially_paid' | 'paid' | 'calculating';
  company_id: string;
  created_at: string;
  updated_at: string;
}
