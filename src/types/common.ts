
// Common types used throughout the application

// Entity types
export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process", 
  SALE = "sale", // Alias for SALES_PROCESS
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  INVOICE = "invoice",
  ADDENDUM = "addendum"
}

// Document categories
export enum DocumentCategory {
  POLICY = "policy",
  CLAIM = "claim",
  INVOICE = "invoice",
  CONTRACT = "contract",
  REPORT = "report",
  CORRESPONDENCE = "correspondence",
  IDENTIFICATION = "identification",
  AUTHORIZATION = "authorization",
  PROPOSAL = "proposal",
  OTHER = "other",
  // Adding missing categories referenced in errors
  SALES = "sales",
  FINANCIAL = "financial",
  LEGAL = "legal",
  MISCELLANEOUS = "miscellaneous",
  LIEN = "lien",
  NOTIFICATION = "notification"
}

// Approval status
export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

// User roles
export enum UserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  AGENT = "agent",
  CLIENT = "client",
  SUPER_ADMIN = "super_admin" // Adding this since it's referenced in the code
}

// Document comment
export interface DocumentComment {
  id?: string;
  document_id: string;
  user_id: string;
  text: string;
  created_at?: string;
  author?: string;
}

// Relation name for supabase tables
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
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents"
  | "policies"
  | "claims"
  | "commissions"
  | "policy_addendums"
  | "sales_processes"
  | "leads"
  | "clients"
  | "insurers"
  | "insurance_products"
  | "policy_types"
  | "profiles"
  | "company_settings"
  | "company_email_settings"
  | "unlinked_payments"
  | "instructions"
  | "fixed_commissions"
  | "client_commissions"
  | "manual_commissions"
  | "invitations"
  | "report_schedules"
  | "saved_reports"
  | "sales_assignments"
  | "saved_filters"
  | "payout_items"
  | "invoice_items"
  | "user_custom_privileges"
  | "document_comments"; // Adding this since it's used in the code

// Location of document/attachment
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// User
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  company_id: string;
  companyId?: string; // Compatibility field
}

// Generic Pagination Model
export interface PaginationModel {
  page: number;
  pageSize: number;
  totalCount: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

// Workflow Status
export enum WorkflowStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

// Service response generic type (added for missing reference)
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
