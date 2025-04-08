
/**
 * Common types used across the application
 */

// Base entity interface for all entities
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  company_id?: string;
}

// Common entity types used throughout the application
export enum EntityType {
  POLICY = 'policy',
  CLAIM = 'claim',
  CLIENT = 'client',
  INVOICE = 'invoice',
  ADDENDUM = 'addendum',
  POLICY_ADDENDUM = 'policy_addendum',
  SALES_PROCESS = 'sales_process',
  SALE = 'sale',
  AGENT = 'agent',
  INSURER = 'insurer'
}

// Document approval status
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review'
}

// Document categories
export enum DocumentCategory {
  POLICY = 'policy',
  CLAIM = 'claim',
  CLIENT = 'client',
  INVOICE = 'invoice',
  OTHER = 'other',
  CLAIM_EVIDENCE = 'claim_evidence',
  MEDICAL = 'medical',
  LEGAL = 'legal',
  FINANCIAL = 'financial',
  LIEN = 'lien', 
  NOTIFICATION = 'notification',
  CORRESPONDENCE = 'correspondence',
  DISCOVERY = 'discovery',
  QUOTE = 'quote',
  PROPOSAL = 'proposal',
  CONTRACT = 'contract',
  CLOSEOUT = 'closeout',
  SALES = 'sales',
  GENERAL = 'general',
  AUTHORIZATION = 'authorization',
  MISCELLANEOUS = 'miscellaneous'
}

// Document approval status - consistent naming with the rest of the app
export enum DocumentApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review'
}

// Comment interface for documents
export interface Comment {
  id: string;
  user_id: string;
  user_name?: string;
  content: string;
  created_at: string;
  document_id: string;
}

// Resource context for authorization checks
export interface ResourceContext {
  companyId?: string;
  organizationId?: string;
  [key: string]: any;
}

// Service response wrapper
export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
  message?: string;
}

// Common pagination parameters
export interface PaginationParams {
  page: number;
  page_size: number;
}

// For use in UI components
export interface PaginationProps extends PaginationParams {
  total_pages: number;
  total_items: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Common pagination response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Common filter parameters
export interface FilterParams extends PaginationParams {
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  [key: string]: any;
}

// Common sort options
export type SortDirection = 'asc' | 'desc';

// Financial transaction types
export type TransactionType = 'income' | 'expense';

// Database table names for type-safe Supabase operations
export type RelationName = 
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents'
  | 'policies'
  | 'claims'
  | 'clients'
  | 'invoices'
  | 'sales_processes'
  | 'policy_addendums'
  | 'agents'
  | 'insurers'
  | 'activity_logs'
  | 'profiles'
  | 'user_custom_privileges';
