
import { EntityType } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * Get the appropriate document table name for a given entity type
 */
export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_documents';
    case EntityType.CLAIM:
      return 'claim_documents';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'sales_documents';
    case EntityType.CLIENT:
      return 'client_documents';
    case EntityType.INSURER:
      return 'insurer_documents';
    case EntityType.AGENT:
      return 'agent_documents';
    case EntityType.ADDENDUM:
      return 'addendum_documents';
    case EntityType.INVOICE:
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
      return EntityType.POLICY;
    case 'claim_documents':
      return EntityType.CLAIM;
    case 'sales_documents':
      return EntityType.SALES_PROCESS;
    case 'client_documents':
      return EntityType.CLIENT;
    case 'insurer_documents':
      return EntityType.INSURER;
    case 'agent_documents':
      return EntityType.AGENT;
    case 'addendum_documents':
      return EntityType.ADDENDUM;
    case 'invoice_documents':
      return EntityType.INVOICE;
    default:
      return EntityType.POLICY;
  }
};

/**
 * Get the entity ID column name for a given entity type
 */
export const getEntityIdColumn = (entityType: EntityType): string => {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_id';
    case EntityType.CLAIM:
      return 'claim_id';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'sales_process_id';
    case EntityType.CLIENT:
      return 'client_id';
    case EntityType.INSURER:
      return 'insurer_id';
    case EntityType.AGENT:
      return 'agent_id';
    case EntityType.ADDENDUM:
      return 'addendum_id';
    case EntityType.INVOICE:
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
