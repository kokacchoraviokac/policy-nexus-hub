
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
  INVOICE = "invoice"
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
  AUTHORIZATION = "authorization"
}

export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export interface ServiceResponse<T> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
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
