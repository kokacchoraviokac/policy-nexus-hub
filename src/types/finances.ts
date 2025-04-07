
export enum CommissionStatus {
  PENDING = "pending",
  CALCULATING = "calculating",
  DUE = "due",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  INVOICED = "invoiced"
}

export interface Commission {
  id: string;
  policy_id: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  paid_amount?: number;
  payment_date?: string;
  status: CommissionStatus;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionWithPolicyDetails extends Commission {
  policy_number: string;
  client_name: string;
  insurer_name: string;
  policy_start_date: string;
  policy_expiry_date: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  entity_id?: string;
  entity_type?: string;
  entity_name: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  currency: string;
  status: string;
  notes?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  policy_id?: string;
  commission_id?: string;
  description: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export interface InvoiceTemplateSettings {
  id?: string;
  name: string;
  is_default: boolean;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  font_size: string;
  font_weight: 'bold' | 'normal' | 'light';
  font_style: 'normal' | 'italic';
  logo_position: 'left' | 'center' | 'right';
  company_info_position: 'left' | 'center' | 'right';
  show_header: boolean;
  show_footer: boolean;
  footer_text: string;
  payment_instructions: string;
}

export interface CreateTemplateData extends InvoiceTemplateSettings {
  company_id: string;
}
