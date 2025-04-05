
import { EntityType } from "@/types/documents";

// Define valid document tables
export const DOCUMENT_TABLES = [
  'policy_documents',
  'claim_documents',
  'sales_documents',
  'client_documents',
  'insurer_documents',
  'agent_documents',
  'invoice_documents',
  'addendum_documents'
] as const;

export type DocumentTableName = typeof DOCUMENT_TABLES[number];

/**
 * Get the corresponding document table name for an entity type
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
  const tableMap: Record<EntityType, DocumentTableName> = {
    policy: 'policy_documents',
    claim: 'claim_documents',
    sales_process: 'sales_documents',
    client: 'client_documents',
    insurer: 'insurer_documents',
    agent: 'agent_documents',
    invoice: 'invoice_documents',
    addendum: 'addendum_documents'
  };
  
  return tableMap[entityType];
}

/**
 * Get entity ID field name for the given entity type
 */
export function getEntityIdFieldName(entityType: EntityType): string {
  const fieldMap: Record<EntityType, string> = {
    policy: 'policy_id',
    claim: 'claim_id',
    sales_process: 'sales_process_id',
    client: 'client_id',
    insurer: 'insurer_id',
    agent: 'agent_id',
    invoice: 'invoice_id',
    addendum: 'addendum_id'
  };
  
  return fieldMap[entityType];
}
