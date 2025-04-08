
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
  ADDENDUM = "addendum" // Alternative name for POLICY_ADDENDUM
}

// Document approval status
export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
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
  OTHER = "other"
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

// Standard filter interfaces
export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface SortParams {
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}
