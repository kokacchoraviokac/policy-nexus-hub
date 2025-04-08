
// Common enums and types used across the application

export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process",
  SALE = "sale",
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  DOCUMENT = "document",
  POLICY_ADDENDUM = "policy_addendum",
  INVOICE = "invoice",
  ADDENDUM = "addendum"
}

export enum DocumentCategory {
  POLICY = "policy",
  CLAIM = "claim",
  INVOICE = "invoice",
  CONTRACT = "contract",
  LEGAL = "legal",
  CORRESPONDENCE = "correspondence",
  SALES = "sales",
  CLIENT = "client",
  OTHER = "other",
  GENERAL = "general",
  AUTHORIZATION = "authorization",
  MISCELLANEOUS = "miscellaneous",
  PROPOSAL = "proposal"
}

export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export enum CommissionStatus {
  DUE = "due",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  PENDING = "pending",
  INVOICED = "invoiced",
  CALCULATING = "calculating"
}

export enum PolicyStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  PENDING = "pending"
}

export enum WorkflowStatus {
  DRAFT = "draft",
  REVIEW = "review",
  APPROVED = "approved",
  REJECTED = "rejected",
  COMPLETE = "complete"
}

export interface ServiceResponse<T> {
  data?: T;
  status: number;
  success: boolean;
  error?: string;
}

export interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsCount?: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  itemsCount?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  
  // Add mapping for tanstack/react-table props
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  author: string;
  text: string;
  created_at: string;
  user_id: string;
}

export interface ResourceContext {
  resource: string;
  action: string;
  condition?: string;
  ownerId?: string;
  companyId?: string;
  resourceType?: string;
  resourceValue?: any;
  [key: string]: any;
}

// Interface for table relations
export type RelationName = 
  | "policy_documents" 
  | "claim_documents" 
  | "sales_documents" 
  | "activity_logs" 
  | "agent_payouts" 
  | "agents" 
  | "companies" 
  | "bank_statements" 
  | "bank_transactions" 
  | "invoices" 
  | "invoice_items" 
  | "leads" 
  | "sales_processes" 
  | "policies" 
  | "policy_addendums" 
  | "clients" 
  | "insurers" 
  | "claims" 
  | "unlinked_payments" 
  | "commissions" 
  | "fixed_commissions" 
  | "client_commissions" 
  | "manual_commissions" 
  | "insurance_products" 
  | "policy_types" 
  | "instructions" 
  | "profiles" 
  | "company_settings" 
  | "company_email_settings" 
  | "report_schedules" 
  | "saved_reports" 
  | "saved_filters" 
  | "sales_assignments" 
  | "invitations" 
  | "user_custom_privileges";

export interface Comment {
  id: string;
  document_id: string;
  author: string;
  text: string;
  created_at: string;
  user_id: string;
}
