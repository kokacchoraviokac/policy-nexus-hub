
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
  ADDENDUM = "addendum" // Add missing ADDENDUM type
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
  MISCELLANEOUS = "miscellaneous", // Add missing MISCELLANEOUS category
  PROPOSAL = "proposal" // Add missing PROPOSAL category
}

export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

// Add missing ApprovalStatus enum
export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export enum CommissionStatus {
  DUE = "due",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid"
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
}

// Add Document Comments interface
export interface DocumentComment {
  id: string;
  document_id: string;
  author: string;
  text: string;
  created_at: string;
  user_id: string;
}

// Add ResourceContext interface to fix auth-related issues
export interface ResourceContext {
  resource: string;
  action: string;
  condition?: string;
}

