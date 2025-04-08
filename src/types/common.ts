
import { Json } from "@/types/supabase";

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  company_id?: string;
}

// Entity type enum
export enum EntityType {
  POLICY = 'policy',
  CLAIM = 'claim',
  CLIENT = 'client',
  INSURER = 'insurer',
  AGENT = 'agent',
  SALES_PROCESS = 'sales_process',
  SALE = 'sale',
  INVOICE = 'invoice',
  POLICY_ADDENDUM = 'policy_addendum',
  PRODUCT = 'product',
  DOCUMENT = 'document',
  USER = 'user',
}

// Document category enum
export enum DocumentCategory {
  POLICY = 'policy',
  CLAIM = 'claim',
  INVOICE = 'invoice',
  CONTRACT = 'contract',
  AGREEMENT = 'agreement',
  IDENTIFICATION = 'identification',
  CORRESPONDENCE = 'correspondence',
  OTHER = 'other'
}

// Document approval status enum
export enum DocumentApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review'
}

// API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, any>;
}

// Service response type
export interface ServiceResponse<T = any> {
  success: boolean;
  data: T | null;
  error: Error | null;
}

// Date range interface
export interface DateRange {
  from?: Date;
  to?: Date;
}

// Comment interface
export interface Comment extends BaseEntity {
  user_id: string;
  content: string;
  document_id?: string;
  entity_id?: string;
  entity_type?: EntityType;
}

// Pagination params interface
export interface PaginationParams {
  page: number;
  page_size: number;
}

// Pagination result interface
export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  }
}

// Tables and views supported by Supabase
export type RelationName = 
  | 'clients'
  | 'insurers'
  | 'insurance_products'
  | 'policies'
  | 'claims'
  | 'sales_processes'
  | 'leads'
  | 'proposals'
  | 'invoices'
  | 'commissions'
  | 'policy_addendums'
  | 'agents'
  | 'profiles'
  | 'saved_filters'
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents'
  | 'activity_logs'
  | 'fixed_commissions'
  | 'client_commissions'
  | 'manual_commissions'
  | 'agent_payouts'
  | 'bank_statements'
  | 'bank_transactions'
  | 'unlinked_payments'
  | 'company_settings'
  | 'company_email_settings'
  | 'companies'
  | 'instructions'
  | 'invitations'
  | 'invoice_items'
  | 'payout_items'
  | 'policy_types'
  | 'report_schedules'
  | 'saved_reports'
  | 'sales_assignments'
  | 'user_custom_privileges';

// Commission status type
export type CommissionStatus = 'pending' | 'due' | 'paid' | 'partially_paid' | 'invoiced';
