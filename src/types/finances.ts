
// Basic Commission Type
export interface CommissionType {
  id: string;
  policy_id: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  paid_amount?: number;
  payment_date?: string;
  status: "calculating" | "due" | "partially_paid" | "paid";
  company_id: string;
  created_at: string;
  updated_at: string;
}

// Basic Invoice Type
export interface Invoice {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: "draft" | "issued" | "paid" | "partially_paid" | "overdue" | "cancelled";
  entity_type?: string;
  entity_id?: string;
  entity_name: string;
  currency: string;
  notes?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  invoice_type?: string;
  invoice_category?: string;
  calculation_reference?: string;
}

// Invoice with items
export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  template_settings?: InvoiceTemplateSettings;
  entity?: any;
}

// Invoice Item
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  amount: number;
  policy_id?: string;
  policy?: any;
  commission_id?: string;
  created_at: string;
  updated_at: string;
}

// Invoice Type alias for backwards compatibility
export type InvoiceType = Invoice;

// Invoice Template
export interface InvoiceTemplate {
  id: string;
  name: string;
  settings: InvoiceTemplateSettings;
  is_default: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
}

// Invoice Template Settings
export interface InvoiceTemplateSettings {
  id?: string;
  name?: string;
  font_family: string;
  font_size: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  show_header: boolean;
  show_footer: boolean;
  header_text?: string;
  footer_text?: string;
  payment_instructions?: string;
  show_payment_instructions?: boolean;
  logo_position?: "left" | "center" | "right";
  font_weight?: "normal" | "bold" | "light";
  font_style?: "normal" | "italic";
  is_default?: boolean;
}

// Commission with Policy Details
export interface CommissionWithPolicyDetails extends CommissionType {
  policy_number?: string;
  policyholder_name?: string;
  insurer_name?: string;
  product_name?: string;
  agent_name?: string;
  currency?: string;
}

// Payment type
export interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  reference: string;
  status: "pending" | "applied" | "rejected";
  entity_type: string;
  entity_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

// Financial Transaction for Reports
export interface FinancialTransaction {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  reference_id?: string;
  reference_type?: string;
  currency: string;
  company_id: string;
  created_at: string;
}

// Bank Statement
export interface BankStatement {
  id: string;
  statement_date: string;
  bank_name: string;
  account_number: string;
  starting_balance: number;
  ending_balance: number;
  file_path?: string;
  status: string;
  processed_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

// Bank Transaction
export interface BankTransaction {
  id: string;
  statement_id: string;
  transaction_date: string;
  description: string;
  amount: number;
  reference?: string;
  status: string;
  matched_invoice_id?: string;
  matched_policy_id?: string;
  matched_at?: string;
  matched_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

// Unlinked Payment Type
export interface UnlinkedPaymentType {
  id: string;
  amount: number;
  payment_date: string;
  payer_name?: string;
  reference?: string;
  status: string;
  linked_policy_id?: string;
  linked_at?: string;
  linked_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  currency: string;
}

export enum CommissionStatus {
  CALCULATING = "calculating",
  DUE = "due",
  PARTIALLY_PAID = "partially_paid",
  PAID = "paid"
}

export interface Commission extends CommissionType {}
