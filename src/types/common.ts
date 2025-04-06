
export enum EntityType {
  POLICY = 'policy',
  CLAIM = 'claim',
  SALES_PROCESS = 'sales_process',
  SALE = 'sale',
  CLIENT = 'client',
  INSURER = 'insurer',
  AGENT = 'agent',
  ADDENDUM = 'addendum',
  INVOICE = 'invoice'
}

// For backward compatibility with string literals
export type EntityTypeString = 
  | 'policy'
  | 'claim'
  | 'sales_process'
  | 'sale'
  | 'client'
  | 'insurer'
  | 'agent'
  | 'addendum'
  | 'invoice';

// Helper function to convert string to enum
export function stringToEntityType(type: EntityTypeString): EntityType {
  switch (type) {
    case 'policy': return EntityType.POLICY;
    case 'claim': return EntityType.CLAIM;
    case 'sales_process': 
    case 'sale': return EntityType.SALES_PROCESS;
    case 'client': return EntityType.CLIENT;
    case 'insurer': return EntityType.INSURER;
    case 'agent': return EntityType.AGENT;
    case 'addendum': return EntityType.ADDENDUM;
    case 'invoice': return EntityType.INVOICE;
    default: throw new Error(`Unknown entity type: ${type}`);
  }
}

// Helper function to convert enum to string
export function entityTypeToString(type: EntityType): EntityTypeString {
  switch (type) {
    case EntityType.POLICY: return 'policy';
    case EntityType.CLAIM: return 'claim';
    case EntityType.SALES_PROCESS: return 'sales_process';
    case EntityType.CLIENT: return 'client';
    case EntityType.INSURER: return 'insurer';
    case EntityType.AGENT: return 'agent';
    case EntityType.ADDENDUM: return 'addendum';
    case EntityType.INVOICE: return 'invoice';
    default: throw new Error(`Unknown entity type: ${type}`);
  }
}

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
  | 'bank_statements'
  | 'bank_transactions'
  | 'claims'
  | 'client_commissions'
  | 'clients'
  | 'commissions'
  | 'companies'
  | 'company_email_settings'
  | 'company_settings'
  | 'fixed_commissions'
  | 'instructions'
  | 'insurance_products'
  | 'insurers'
  | 'invitations'
  | 'invoice_items'
  | 'invoices'
  | 'leads'
  | 'manual_commissions'
  | 'payout_items'
  | 'policies'
  | 'policy_addendums'
  | 'policy_types'
  | 'profiles'
  | 'report_schedules'
  | 'sales_assignments'
  | 'sales_processes'
  | 'saved_filters'
  | 'saved_reports'
  | 'unlinked_payments'
  | 'user_custom_privileges';

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
