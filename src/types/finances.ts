
export interface Commission {
  id: string;
  policy_id: string;
  amount: number;
  percentage: number;
  status: CommissionStatus;
  payment_date?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  
  // Additional fields from database
  base_amount?: number;
  rate?: number;
  calculated_amount?: number;
  paid_amount?: number;
}

export enum CommissionStatus {
  PENDING = "pending",
  INVOICED = "invoiced",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid"
}

export interface CommissionType {
  id: string;
  policy_id: string;
  amount: number;
  percentage: number;
  status: CommissionStatus;
  payment_date?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  
  // Additional fields
  base_amount?: number;
  rate?: number;
  calculated_amount?: number;
  paid_amount?: number;
}

export interface CommissionWithPolicyDetails extends Commission {
  policy_number: string;
  client_name: string;
  insurer_name: string;
  policy_type: string;
  expiry_date: string;
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

export interface Invoice {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  entity_id?: string;
  entity_type?: string;
  entity_name: string;
  total_amount: number;
  currency: string;
  status: InvoiceStatus;
  notes?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export enum InvoiceStatus {
  DRAFT = "draft",
  PENDING = "pending",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled"
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export type InvoiceType = Invoice;

export interface BankStatement {
  id: string;
  statement_number: string;
  bank_name: string;
  account_number: string;
  statement_date: string;
  beginning_balance: number;
  ending_balance: number;
  total_credits: number;
  total_debits: number;
  currency: string;
  status: string;
  file_path?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  
  // Additional fields
  starting_balance?: number;
  processed_by?: string;
  processed_at?: string;
}

export interface BankTransaction {
  id: string;
  statement_id: string;
  transaction_date: string;
  description: string;
  amount: number;
  running_balance: number;
  is_debit: boolean;
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

export interface InvoiceTemplateSettings {
  id?: string;
  name: string;
  is_default?: boolean;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  font_size: string;
  background_color: string;
  logo_position: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
  font_weight: "bold" | "normal" | "light";
  font_style: "normal" | "italic";
  address_format: string;
  amount_format: string;
  payment_instructions: string;
}

export interface CreateTemplateData {
  company_id: string;
  name: string;
  is_default: boolean;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  font_size: string;
  background_color: string;
  font_weight: "bold" | "normal" | "light";
  font_style: "normal" | "italic";
  logo_position: string;
  address_format: string;
  amount_format: string;
  payment_instructions: string;
}
