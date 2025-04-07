
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  entity_id?: string;
  entity_type?: string;
  policy?: any;
}

export interface Invoice {
  id: string;
  company_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  currency: string;
  status: string;
  entity_id?: string;
  entity_type?: string;
  entity?: any;
  entity_name?: string;
  invoice_type?: string;
  invoice_category?: string;
  calculation_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export interface Commission {
  id: string;
  policy_id: string;
  amount: number;
  percentage: number;
  currency: string;
  status: string;
  calculation_id?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionType {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  is_default: boolean;
}

export interface BankStatement {
  id: string;
  statement_number: string;
  bank_name: string;
  statement_date: string;
  total_credits: number;
  total_debits: number;
  beginning_balance: number;
  ending_balance: number;
  currency: string;
  status: string;
  file_path?: string;
  txt_file_path?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  id: string;
  statement_id: string;
  transaction_date: string;
  description: string;
  amount: number;
  running_balance: number;
  is_debit: boolean;
  reference: string;
  status: string;
  matched_entity_id?: string;
  matched_entity_type?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface UnlinkedPaymentType {
  id: string;
  reference: string;
  payer_name: string;
  amount: number;
  payment_date: string;
  status: string;
  currency: string;
  linked_policy_id?: string;
  linked_at?: string;
  linked_by?: string;
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
  font_weight: "bold" | "normal" | "light";
  font_style: "normal" | "italic";
  logo_position: "left" | "center" | "right";
  background_color: string;
  header_text?: string;
  footer_text: string;
  payment_instructions: string;
  company_info_position?: "top" | "bottom";
  show_header?: boolean;
  show_footer?: boolean;
  show_payment_instructions?: boolean;
}
