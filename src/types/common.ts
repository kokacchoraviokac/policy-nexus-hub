
export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process",
  SALE = "sale",
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  INVOICE = "invoice",
  ADDENDUM = "addendum"
}

export enum DocumentCategory {
  POLICY = "policy",
  CLAIM = "claim",
  INVOICE = "invoice",
  CONTRACT = "contract",
  NOTIFICATION = "notification",
  LIEN = "lien",
  OTHER = "other",
  PROPOSAL = "proposal",
  QUOTE = "quote",
  SALES = "sales",
  FINANCIAL = "financial",
  LEGAL = "legal",
  MEDICAL = "medical",
  CORRESPONDENCE = "correspondence",
  MISCELLANEOUS = "miscellaneous"
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export interface DocumentComment {
  id?: string;
  author: string;
  text: string;
  created_at: string;
}

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  EMPLOYEE = "employee",
  AGENT = "agent",
  CLIENT = "client"
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
  message?: string;
}

export enum CommissionStatus {
  CALCULATING = "calculating",
  DUE = "due",
  PARTIALLY_PAID = "partially_paid",
  PAID = "paid",
  INVOICED = "invoiced",
  PENDING = "pending"
}

export enum WorkflowStatus {
  DRAFT = "draft",
  IN_REVIEW = "in_review",
  READY = "ready",
  COMPLETE = "complete",
  REVIEW = "review",
  REJECTED = "rejected"
}

export type RelationName = 
  | "policy_documents"
  | "claim_documents" 
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents"
  | "activity_logs"
  | "agent_payouts"
  | "agents"
  | "bank_statements"
  | "bank_transactions"
  | "claim_documents"
  | "claims"
  | "client_commissions"
  | "clients"
  | "commissions"
  | "companies"
  | "company_email_settings"
  | "company_settings"
  | "fixed_commissions"
  | "instructions"
  | "insurance_products"
  | "insurers"
  | "invitations"
  | "invoice_items"
  | "invoices"
  | "leads"
  | "manual_commissions"
  | "payout_items"
  | "policies"
  | "policy_addendums"
  | "policy_types"
  | "profiles"
  | "report_schedules"
  | "sales_assignments"
  | "sales_processes"
  | "saved_filters"
  | "saved_reports"
  | "unlinked_payments"
  | "user_custom_privileges"
  | "document_comments";
