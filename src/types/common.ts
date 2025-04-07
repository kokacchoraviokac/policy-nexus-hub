
// Common Types used across the application

export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process",
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  ADDENDUM = "addendum",
  INVOICE = "invoice",
  SALE = "sale" // Alias for sales_process
}

export enum DocumentCategory {
  POLICY = "policy",
  CLAIM = "claim",
  SALES = "sales",
  FINANCIAL = "financial",
  LEGAL = "legal",
  CONTRACT = "contract",
  INVOICE = "invoice",
  MISCELLANEOUS = "miscellaneous",
  OTHER = "other"
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
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
  | "companies"
  | "bank_statements"
  | "bank_transactions"
  | "invoices"
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
  | "user_custom_privileges";
