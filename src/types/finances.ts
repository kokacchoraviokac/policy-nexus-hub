
// Types for financial operations

// Commission status enum
export enum CommissionStatus {
  PENDING = "pending",
  PAID = "paid", 
  INVOICED = "invoiced"
}

// Commission type enum
export enum CommissionType {
  AUTOMATIC = "automatic",
  MANUAL = "manual"
}

// Base Commission interface
export interface Commission {
  id: string;
  policy_id: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  status: CommissionStatus;
  paid_amount?: number;
  payment_date?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

// Commission with extended policy details
export interface CommissionWithPolicyDetails extends Commission {
  policy_number: string;
  policyholder_name: string;
  insurer_name: string;
  premium: number;
  currency: string;
}

// Invoice types
export interface Invoice {
  id: string;
  invoice_number: string;
  entity_id?: string;
  entity_type?: string;
  entity_name: string;
  issue_date: string;
  due_date: string;
  status: string;
  total_amount: number;
  currency: string;
  notes?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  invoice_type?: string;
  invoice_category?: string;
  calculation_reference?: string;
}

export type InvoiceType = Invoice;

// Invoice with items
export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  entity?: any; // The related entity (policy, client, etc.)
}

// Invoice item
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  policy_id?: string;
  commission_id?: string;
  description: string;
  amount: number;
  created_at: string;
  updated_at: string;
  policy?: any; // Optional reference to policy details
}

// Invoice template settings
export interface InvoiceTemplateSettings {
  id?: string;
  name: string;
  company_id: string;
  is_default: boolean;
  header_content?: string;
  footer_content?: string;
  company_logo_position?: string;
  theme_color?: string;
  font_family?: string;
  created_at?: string;
  updated_at?: string;
}

// Financial transaction
export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  reference?: string;
  entity_id?: string;
  entity_type?: string;
  currency?: string;
}

// Transaction type enum
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense"
}

// Bank transaction
export interface BankTransaction {
  id: string;
  statement_id: string;
  transaction_date: string;
  amount: number;
  description: string;
  reference?: string;
  status: string;
  matched_policy_id?: string;
  matched_invoice_id?: string;
  matched_at?: string;
  matched_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

// Bank statement
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

// Unlinked payment
export interface UnlinkedPayment {
  id: string;
  amount: number;
  payment_date: string;
  currency: string;
  reference?: string;
  payer_name?: string;
  status: string;
  linked_policy_id?: string;
  linked_at?: string;
  linked_by?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export type UnlinkedPaymentType = UnlinkedPayment;
