
// Common types used throughout the application

// Entity types for documents and other objects
export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process",
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  INVOICE = "invoice",
  POLICY_ADDENDUM = "policy_addendum",
  ADDENDUM = "addendum", // Alternative name for POLICY_ADDENDUM
  SALE = "sale" // Alternative name for SALES_PROCESS
}

// Document approval status
export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

// Common category enumeration
export enum DocumentCategory {
  POLICY = "policy",
  INVOICE = "invoice",
  CLAIM = "claim",
  CONTRACT = "contract",
  LEGAL = "legal",
  CORRESPONDENCE = "correspondence",
  MARKETING = "marketing",
  OTHER = "other",
  SALES = "sales",
  MISCELLANEOUS = "miscellaneous",
  AUTHORIZATION = "authorization",
  GENERAL = "general",
  PROPOSAL = "proposal"
}

// For use with document approvals
export interface ApprovalStatus {
  status: DocumentApprovalStatus;
  date?: string;
  user_id?: string;
  notes?: string;
}

// Document comment interface
export interface Comment {
  id: string;
  document_id: string;
  user_id: string;
  author: string;
  text: string;
  created_at: string;
}

// Currency type
export type Currency = "EUR" | "USD" | "RSD" | "GBP" | "CHF" | string;

// Resource context interface for permission checks
export interface ResourceContext {
  companyId?: string;
  userId?: string;
  resourceId?: string;
  resourceType?: string;
  resourceOwnerId?: string;
  action?: string;
  meta?: Record<string, any>;
}

// Base entity interface with common properties
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

// Generic status enums
export enum CommonStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  COMPLETED = "completed"
}

// Standard pagination parameters
export interface PaginationParams {
  page: number;
  page_size: number;
}

// Pagination controller props
export interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  itemsCount: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

// Props for pagination component
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Standard filter interfaces
export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface SortParams {
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

// Service response pattern
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
  message?: string;
}

// Relation names for database tables
export type RelationName = 
  | "activity_logs"
  | "agent_payouts"
  | "agents"
  | "companies"
  | "bank_statements"
  | "bank_transactions"
  | "invoices"
  | "policies"
  | "claim_documents"
  | "claims"
  | "client_commissions"
  | "clients"
  | "commissions"
  | "company_email_settings"
  | "company_settings"
  | "fixed_commissions"
  | "instructions"
  | "insurance_products"
  | "insurers"
  | "invitations"
  | "invoice_items"
  | "leads"
  | "manual_commissions"
  | "payout_items"
  | "policy_addendums"
  | "policy_documents"
  | "policy_types"
  | "profiles"
  | "report_schedules"
  | "sales_assignments"
  | "sales_documents"
  | "sales_processes"
  | "saved_filters"
  | "saved_reports"
  | "unlinked_payments"
  | "user_custom_privileges"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents";
