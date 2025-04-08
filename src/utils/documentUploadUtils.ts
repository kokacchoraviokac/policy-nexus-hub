
import { DocumentTableName, EntityType } from '@/types/documents';

/**
 * Get the document table name based on entity type
 * @param entityType The entity type
 * @returns The document table name
 */
export const getDocumentTableName = (entityType: EntityType | string): DocumentTableName => {
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
    case EntityType.INVOICE:
      return 'invoice_documents';
    case EntityType.POLICY_ADDENDUM:
    case EntityType.ADDENDUM:
      return 'addendum_documents';
    default:
      return 'policy_documents'; // Default fallback
  }
};

/**
 * Get the entity ID column name based on entity type
 * @param entityType The entity type
 * @returns The entity ID column name
 */
export const getEntityIdColumn = (entityType: EntityType | string): string => {
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
    case EntityType.INVOICE:
      return 'invoice_id';
    case EntityType.POLICY_ADDENDUM:
    case EntityType.ADDENDUM:
      return 'addendum_id';
    default:
      return 'entity_id';
  }
};

/**
 * Convert an entity type to a table name
 * @param entityType The entity type
 * @returns The table name
 */
export const asTableName = (entityType: EntityType | string): string => {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policies';
    case EntityType.CLAIM:
      return 'claims';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'sales_processes';
    case EntityType.CLIENT:
      return 'clients';
    case EntityType.INSURER:
      return 'insurers';
    case EntityType.AGENT:
      return 'agents';
    case EntityType.INVOICE:
      return 'invoices';
    case EntityType.POLICY_ADDENDUM:
    case EntityType.ADDENDUM:
      return 'policy_addendums';
    default:
      return entityType as string;
  }
};
