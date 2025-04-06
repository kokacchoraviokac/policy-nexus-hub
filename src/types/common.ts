
export enum EntityType {
  POLICY = 'policy',
  CLAIM = 'claim',
  SALES_PROCESS = 'sales_process',
  CLIENT = 'client',
  AGENT = 'agent',
  INSURER = 'insurer',
  ADDENDUM = 'addendum',
  INVOICE = 'invoice'
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
  [EntityType.CLIENT]: 'client_documents',
  [EntityType.AGENT]: 'agent_documents',
  [EntityType.INSURER]: 'insurer_documents',
  [EntityType.ADDENDUM]: 'addendum_documents',
  [EntityType.INVOICE]: 'invoice_documents'
};
