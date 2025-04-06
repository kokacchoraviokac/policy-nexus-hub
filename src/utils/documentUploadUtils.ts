
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
