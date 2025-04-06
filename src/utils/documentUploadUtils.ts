
import { EntityType, DocumentTableName } from "@/types/documents";

/**
 * Get the appropriate document table name for a given entity type
 */
export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case 'policy':
      return 'policy_documents';
    case 'claim':
      return 'claim_documents';
    case 'sales_process':
    case 'sale':
      return 'sales_documents';
    case 'client':
      return 'client_documents';
    case 'insurer':
      return 'insurer_documents';
    case 'agent':
      return 'agent_documents';
    case 'addendum':
      return 'addendum_documents';
    case 'invoice':
      return 'invoice_documents';
    default:
      // Default to policy_documents if unknown
      return 'policy_documents';
  }
};

/**
 * Convert a document table name to its corresponding entity type
 */
export const tableNameToEntityType = (tableName: DocumentTableName): EntityType => {
  switch (tableName) {
    case 'policy_documents':
      return 'policy';
    case 'claim_documents':
      return 'claim';
    case 'sales_documents':
      return 'sales_process';
    case 'client_documents':
      return 'client';
    case 'insurer_documents':
      return 'insurer';
    case 'agent_documents':
      return 'agent';
    case 'addendum_documents':
      return 'addendum';
    case 'invoice_documents':
      return 'invoice';
    default:
      return 'policy';
  }
};

/**
 * Get the entity ID column name for a given entity type
 */
export const getEntityIdColumn = (entityType: EntityType): string => {
  switch (entityType) {
    case 'policy':
      return 'policy_id';
    case 'claim':
      return 'claim_id';
    case 'sales_process':
    case 'sale':
      return 'sales_process_id';
    case 'client':
      return 'client_id';
    case 'insurer':
      return 'insurer_id';
    case 'agent':
      return 'agent_id';
    case 'addendum':
      return 'addendum_id';
    case 'invoice':
      return 'invoice_id';
    default:
      return 'entity_id';
  }
};

/**
 * Helper to safely cast a string to a DocumentTableName
 */
export const asTableName = (tableName: string): DocumentTableName => {
  const validTableNames: DocumentTableName[] = [
    'policy_documents',
    'claim_documents',
    'sales_documents',
    'client_documents',
    'insurer_documents',
    'agent_documents',
    'addendum_documents',
    'invoice_documents'
  ];

  if (validTableNames.includes(tableName as DocumentTableName)) {
    return tableName as DocumentTableName;
  }

  console.warn(`Invalid table name: ${tableName}, using policy_documents as fallback`);
  return 'policy_documents';
};
