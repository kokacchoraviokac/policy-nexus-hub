
// Common Types used across the application

export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process",
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  ADDENDUM = "addendum",
  INVOICE = "invoice",
  SALE = "sale" // Alias for sales_process
}

export enum DocumentCategory {
  POLICY = "policy",
  CLAIM = "claim",
  SALES = "sales",
  FINANCIAL = "financial",
  LEGAL = "legal",
  CONTRACT = "contract",
  INVOICE = "invoice",
  MISCELLANEOUS = "miscellaneous",
  PROPOSAL = "proposal",
  OTHER = "other",
  LIEN = "lien",
  NOTIFICATION = "notification",
  CORRESPONDENCE = "correspondence",
  DISCOVERY = "discovery",
  QUOTE = "quote",
  CLOSEOUT = "closeout",
  MEDICAL = "medical",
  CLAIM_EVIDENCE = "claim_evidence"
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

// Rather than using string literals in a union type, we define all valid table names
// This makes it easier to add new tables and ensures consistency
export type RelationName =
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents"
  | "activity_logs"
  | "agent_payouts"
  | "agents"
  | "companies"
  | "bank_statements"
  | "bank_transactions"
  | "invoices"
  | "policies"
  | "policy_addendums" 
  | "policy_types"
  | "profiles"
  | "report_schedules"
  | "sales_assignments"
  | "sales_processes"
  | "saved_filters"
  | "saved_reports"
  | "unlinked_payments"
  | "user_custom_privileges";

// Add ServiceResponse type which is missing
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Extend UserRole enum for consistency
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  EMPLOYEE = "employee",
  AGENT = "agent",
  CLIENT = "client"
}

// DocumentComment interface for structured comments
export interface DocumentComment {
  id?: string;
  document_id?: string;
  author: string;
  user_id?: string;
  text: string;
  created_at: string;
}

// Financial transaction types
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense"
}

// Common pagination related interfaces
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Type for roles in string format - useful when dealing with API responses
export type UserRoleString = 'super_admin' | 'admin' | 'employee' | 'agent' | 'client';

// Type for entity types in string format - useful when dealing with API responses
export type EntityTypeString = 'policy' | 'claim' | 'sales_process' | 'sale' | 'client' | 'insurer' | 'agent' | 'addendum' | 'invoice';

// Export string type equivalents of enum values for better interoperability
export type DocumentCategoryString = 
  | 'policy' 
  | 'claim' 
  | 'sales' 
  | 'financial' 
  | 'legal' 
  | 'contract' 
  | 'invoice' 
  | 'miscellaneous' 
  | 'proposal' 
  | 'other'
  | 'lien'
  | 'notification'
  | 'correspondence'
  | 'discovery'
  | 'quote'
  | 'closeout'
  | 'medical'
  | 'claim_evidence';
