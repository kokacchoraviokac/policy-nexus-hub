
import { EntityType } from '@/types/common';
import { DocumentTableName } from '@/types/documents';

/**
 * Gets the document table name for a given entity type
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
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
    case EntityType.ADDENDUM:
      return 'addendum_documents';
    default:
      throw new Error(`No document table mapping for entity type: ${entityType}`);
  }
}

/**
 * Gets the entity ID column name for a given entity type
 */
export function getEntityIdColumn(entityType: EntityType): string {
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
    case EntityType.ADDENDUM:
      return 'addendum_id';
    default:
      throw new Error(`No entity ID column mapping for entity type: ${entityType}`);
  }
}

/**
 * Helper to safely convert a string to a DocumentTableName
 */
export function asTableName(name: string): DocumentTableName {
  if (
    name === 'policy_documents' ||
    name === 'claim_documents' ||
    name === 'sales_documents' ||
    name === 'client_documents' ||
    name === 'insurer_documents' ||
    name === 'agent_documents' ||
    name === 'invoice_documents' ||
    name === 'addendum_documents'
  ) {
    return name as DocumentTableName;
  }
  throw new Error(`Invalid document table name: ${name}`);
}
