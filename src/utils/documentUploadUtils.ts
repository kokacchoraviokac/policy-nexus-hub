
import { EntityType } from '@/types/common';
import { DocumentTableName } from '@/types/documents';

/**
 * Get the document table name for a specific entity type
 */
export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_documents';
    case EntityType.CLAIM:
      return 'claim_documents';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE: // Support both SALE and SALES_PROCESS
      return 'sales_documents';
    case EntityType.CLIENT:
      return 'client_documents';
    case EntityType.INSURER:
      return 'insurer_documents';
    default:
      // Default to policy documents, but we should handle all cases explicitly
      console.warn(`No document table defined for entity type: ${entityType}`);
      return 'policy_documents';
  }
};

/**
 * Get the entity ID column name for a specific document table
 */
export const getEntityIdColumn = (entityType: EntityType): string => {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_id';
    case EntityType.CLAIM:
      return 'claim_id';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE: // Support both SALE and SALES_PROCESS
      return 'sales_process_id';
    case EntityType.CLIENT:
      return 'client_id';
    case EntityType.INSURER:
      return 'insurer_id';
    default:
      console.warn(`No entity ID column defined for entity type: ${entityType}`);
      return 'entity_id';
  }
};

/**
 * Maps an entity type to its corresponding document table name
 * This function can be used for dynamic table name generation
 */
export const asTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_documents';
    case EntityType.CLAIM:
      return 'claim_documents';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE: // Support both SALE and SALES_PROCESS
      return 'sales_documents';
    case EntityType.CLIENT:
      return 'client_documents';
    case EntityType.INSURER:
      return 'insurer_documents';
    default:
      console.warn(`No table name mapping for entity type: ${entityType}`);
      return 'policy_documents';
  }
};
