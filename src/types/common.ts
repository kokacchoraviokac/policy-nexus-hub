
// Basic types that can be shared across the application

// Entity types for documents and other related functionalities
export type EntityType = 
  | 'policy'
  | 'claim'
  | 'client'
  | 'insurer'
  | 'sales_process'
  | 'sale' // Added this alias
  | 'agent'
  | 'invoice'
  | 'addendum';

// Document categories
export type DocumentCategory = 
  | 'policy'
  | 'claim'
  | 'client'
  | 'invoice'
  | 'proposal'
  | 'quote'
  | 'identification'
  | 'other';

// Service response type for API calls
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: Error | string;
}

// Define Supabase relation names to ensure type safety
export type RelationName =
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'addendum_documents'
  | 'invoice_documents'
  | 'activity_logs'
  | 'agent_payouts'
  | 'agents'
  | 'companies'
  | 'bank_statements'
  | 'bank_transactions'
  | 'invoices'
  | 'policies'
  | 'claims'
  | 'clients'
  | 'insurers'
  | 'commissions'
  | 'user_custom_privileges';
