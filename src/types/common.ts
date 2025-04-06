
export enum EntityType {
  POLICY = 'policy',
  CLAIM = 'claim',
  SALES_PROCESS = 'sales_process',
  CLIENT = 'client',
  AGENT = 'agent',
  INSURER = 'insurer',
  ADDENDUM = 'addendum',
  INVOICE = 'invoice',
  SALE = 'sale', // Alias for sales_process
  PRODUCT = 'product',
  COMMISSION = 'commission',
  PAYMENT = 'payment',
  PROPOSAL = 'proposal'
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

// Helper mapping from EntityType to document table names
export const entityToDocumentTable: Record<EntityType, RelationName> = {
  [EntityType.POLICY]: 'policy_documents',
  [EntityType.CLAIM]: 'claim_documents',
  [EntityType.SALES_PROCESS]: 'sales_documents',
  [EntityType.SALE]: 'sales_documents',
  [EntityType.CLIENT]: 'client_documents',
  [EntityType.AGENT]: 'agent_documents',
  [EntityType.INSURER]: 'insurer_documents',
  [EntityType.ADDENDUM]: 'addendum_documents',
  [EntityType.INVOICE]: 'invoice_documents',
  [EntityType.PRODUCT]: 'policy_documents', // Map product to policy_documents for now
  [EntityType.COMMISSION]: 'policy_documents', // Map commission to policy_documents for now
  [EntityType.PAYMENT]: 'policy_documents', // Map payment to policy_documents for now
  [EntityType.PROPOSAL]: 'sales_documents' // Map proposal to sales_documents
};

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Export DocumentCategory from common.ts
export enum DocumentCategory {
  POLICY = 'policy',
  CLAIM = 'claim',
  INVOICE = 'invoice',
  LIEN = 'lien',
  NOTIFICATION = 'notification',
  CONTRACT = 'contract',
  MISCELLANEOUS = 'miscellaneous',
  PROPOSAL = 'proposal',
  DISCOVERY = 'discovery',
  QUOTE = 'quote',
  CLOSEOUT = 'closeout',
  CLIENT = 'client',
  CLAIM_EVIDENCE = 'claim_evidence',
  MEDICAL = 'medical',
  LEGAL = 'legal',
  FINANCIAL = 'financial',
  CORRESPONDENCE = 'correspondence',
  OTHER = 'other'
}
