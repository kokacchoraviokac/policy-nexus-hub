import { ReactNode } from "react";

// Document-related types
export enum DocumentCategory {
  POLICY = "policy",
  CLAIM = "claim",
  CLIENT = "client",
  INVOICE = "invoice",
  ADDENDUM = "addendum",
  OTHER = "other",
  CLAIM_EVIDENCE = "claim_evidence",
  MEDICAL = "medical",
  LEGAL = "legal",
  FINANCIAL = "financial",
  LIEN = "lien",
  NOTIFICATION = "notification",
  CORRESPONDENCE = "correspondence",
  DISCOVERY = "discovery",
  QUOTE = "quote",
  PROPOSAL = "proposal",
  CONTRACT = "contract",
  CLOSEOUT = "closeout",
  SALES = "sales",
  AUTHORIZATION = "authorization",
  GENERAL = "general",
  MISCELLANEOUS = "miscellaneous"
}

export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  CLIENT = "client",
  INVOICE = "invoice",
  ADDENDUM = "addendum",
  SALES_PROCESS = "sales_process",
  SALE = "sale",
  AGENT = "agent",
  INSURER = "insurer"
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export interface Comment {
  id: string;
  document_id: string;
  text: string;
  author: string;
  user_id: string;
  created_at: string;
}

export interface ResourceContext {
  id: string;
  type: string;
  permissions: string[];
}

// Pagination-related types
export interface PaginationParams {
  page: number;
  page_size: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsCount?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
  itemsCount?: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

// Service response types
export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
  message?: string;
}

// Database relation types
export type RelationName = string;

// Filtering
export interface ActiveFilter {
  id: string;
  group: string;
  label: string;
  value: string;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

// Other commonly used types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}
