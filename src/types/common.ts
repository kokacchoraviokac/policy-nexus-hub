
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
