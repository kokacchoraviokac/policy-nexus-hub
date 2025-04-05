
import { EntityType, DocumentTableMapping } from "@/types/documents";

/**
 * Map entity types to their corresponding document table names
 */
export const getDocumentTableName = (entityType: EntityType): string => {
  const tableMapping: DocumentTableMapping = {
    policy: 'policy_documents',
    claim: 'claim_documents',
    sales_process: 'sales_documents',
    client: 'client_documents',
    insurer: 'insurer_documents',
    agent: 'agent_documents'
  };
  
  return tableMapping[entityType] || 'policy_documents'; // Default to policy_documents
};

/**
 * Maps an entity type to the ID field name in the document table
 */
export const getEntityIdFieldName = (entityType: EntityType): string => {
  const fieldMapping: Record<EntityType, string> = {
    policy: 'policy_id',
    claim: 'claim_id',
    sales_process: 'sales_process_id',
    client: 'client_id',
    insurer: 'insurer_id',
    agent: 'agent_id'
  };
  
  return fieldMapping[entityType] || 'entity_id';
};

/**
 * Check if the given table name is a valid document table
 */
export const isDocumentTable = (tableName: string): boolean => {
  const validTables = [
    'policy_documents', 
    'claim_documents', 
    'sales_documents', 
    'client_documents',
    'insurer_documents',
    'agent_documents'
  ];
  
  return validTables.includes(tableName);
};

/**
 * Get entity type from document table name
 */
export const getEntityTypeFromTable = (tableName: string): EntityType => {
  const mapping: Record<string, EntityType> = {
    'policy_documents': 'policy',
    'claim_documents': 'claim',
    'sales_documents': 'sales_process',
    'client_documents': 'client',
    'insurer_documents': 'insurer',
    'agent_documents': 'agent'
  };
  
  return mapping[tableName] || 'policy';
};
