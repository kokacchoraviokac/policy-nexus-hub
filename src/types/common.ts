
import type { Json } from "@/types/supabase";
import { User } from "@/types/auth";

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Document category enumeration
export enum DocumentCategory {
  POLICY = "policy",
  CLAIM = "claim",
  INVOICE = "invoice",
  CONTRACT = "contract",
  SALES = "sales",
  LEGAL = "legal",
  MISCELLANEOUS = "miscellaneous",
  AUTHORIZATION = "authorization",
  GENERAL = "general",
  PROPOSAL = "proposal",
  OTHER = "other"
}

// Document approval status
export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

// EntityType enum
export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process",
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  INVOICE = "invoice",
  POLICY_ADDENDUM = "policy_addendum",
  ADDENDUM = "addendum",
  SALE = "sale" // Alias for sales_process
}

// Comment interface
export interface Comment {
  id: string;
  user_id: string;
  document_id: string;
  content: string;
  author?: string; // For backward compatibility
  text?: string;   // For backward compatibility
  created_at: string;
  updated_at: string;
}

// Service response
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

// Relation name type (for database tables)
export type RelationName = string;

// Pagination controller props
export interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  totalCount?: number;
  itemsCount?: number; // Additional prop for compatibility
  itemsPerPage?: number; // Additional prop for compatibility
  totalItems?: number; // Additional prop for compatibility
}

// Define the pagination props interface that matches the component implementation
export interface PaginationProps {
  page: number;
  total_pages: number;
  onPageChange: (page: number) => void;
  // Add optional backward compatibility aliases
  currentPage?: number;
  totalPages?: number;
  itemsCount?: number;
  itemsPerPage?: number;
}
