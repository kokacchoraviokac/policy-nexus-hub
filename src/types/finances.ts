
import { BaseEntity } from "./common";

export enum CommissionStatus {
  CALCULATING = "calculating",
  PENDING = "pending",
  DUE = "due",
  PARTIALLY_PAID = "partially_paid",
  PAID = "paid",
  INVOICED = "invoiced"
}

export interface Commission extends BaseEntity {
  policy_id: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  paid_amount?: number;
  status: CommissionStatus;
  payment_date?: string;
  company_id: string;
}

export interface CommissionWithPolicyDetails extends Commission {
  policy_number?: string;
  client_name?: string;
  insurer_name?: string;
  premium?: number;
  currency?: string;
  start_date?: string;
  expiry_date?: string;
}

export interface BankStatement extends BaseEntity {
  statement_number: string;
  bank_name: string;
  account_number: string;
  statement_date: string;
  beginning_balance: number;
  ending_balance: number;
  total_credits: number;
  total_debits: number;
  status: string;
  processed_by?: string;
  file_path?: string | null;
  currency: string;
  company_id: string;
}

export interface UnlinkedPayment extends BaseEntity {
  amount: number;
  payment_date: string;
  payer_name?: string;
  reference?: string;
  status: string;
  linked_policy_id?: string;
  linked_by?: string;
  linked_at?: string;
  currency: string;
  company_id: string;
}

export interface Invoice extends BaseEntity {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: string;
  entity_id?: string;
  entity_type?: string;
  entity_name: string;
  currency: string;
  notes?: string;
  company_id: string;
}

export interface InvoiceItem extends BaseEntity {
  invoice_id: string;
  description: string;
  amount: number;
  policy_id?: string;
  commission_id?: string;
}
