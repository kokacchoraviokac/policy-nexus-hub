
export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process",
  INVOICE = "invoice",
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  SALE = "sale",
  REPORT = "report",
  ADDENDUM = "addendum"
}

export enum ApprovalStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
  NEEDS_REVIEW = "needs_review"
}

export type DocumentCategory = 
  | "policy_document"
  | "claim_document"
  | "invoice"
  | "client_document"
  | "insurer_document"
  | "contract"
  | "authorization"
  | "sales_document"
  | "quote"
  | "proposal"
  | "general";

export type RelationName =
  | "policies"
  | "claims"
  | "invoices"
  | "clients"
  | "insurers"
  | "policy_documents"
  | "claim_documents"
  | "invoice_documents"
  | "client_documents"
  | "insurer_documents"
  | "sales_documents"
  | "policy_addendums"
  | "agents"
  | "users"
  | "user_custom_privileges"
  | "sales_processes"
  | "invitations"
  | "activity_logs"
  | "commissions"
  | "bank_statements"
  | "bank_transactions"
  | "leads"
  | "profiles"
  | "unlinked_payments"
  | "document_comments";

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export enum CommissionStatus {
  PENDING = "pending",
  INVOICED = "invoiced",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid"
}

export interface DocumentComment {
  id: string;
  document_id: string;
  text: string;
  author: string;
  created_at: string;
  user_id: string;
}
