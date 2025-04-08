import { EntityType } from "@/types/documents";

export type DocumentTableName = 
  | "policy_documents" 
  | "claim_documents"
  | "client_documents"
  | "invoice_documents"
  | "sales_documents"
  | "addendum_documents"
  | "agent_documents"
  | "insurer_documents";

/**
 * Get the appropriate document table name for a given entity type
 * @param entityType The type of entity to get the table name for
 * @returns The document table name
 */
export const getDocumentTableName = (entityType: EntityType | string): DocumentTableName => {
  switch (entityType) {
    case EntityType.POLICY:
      return "policy_documents";
    case EntityType.CLAIM:
      return "claim_documents";
    case EntityType.CLIENT:
      return "client_documents";
    case EntityType.INVOICE:
      return "invoice_documents";
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return "sales_documents";
    case EntityType.ADDENDUM:
    case EntityType.POLICY_ADDENDUM:
      return "addendum_documents";
    case EntityType.AGENT:
      return "agent_documents";
    case EntityType.INSURER:
      return "insurer_documents";
    default:
      return "client_documents"; // Default fallback
  }
};

/**
 * Get the entity ID column name for a given document table
 * @param tableName The document table name
 * @returns The entity ID column name
 */
export const getEntityIdColumn = (tableName: DocumentTableName): string => {
  switch (tableName) {
    case "policy_documents":
      return "policy_id";
    case "claim_documents":
      return "claim_id";
    case "client_documents":
      return "client_id";
    case "invoice_documents":
      return "invoice_id";
    case "sales_documents":
      return "sales_process_id";
    case "addendum_documents":
      return "addendum_id";
    case "agent_documents":
      return "agent_id";
    case "insurer_documents":
      return "insurer_id";
    default:
      return "entity_id"; // Fallback
  }
};

/**
 * Convert entity type to table name
 * @param entityType The entity type
 * @returns The table name
 */
export const asTableName = (entityType: EntityType | string | DocumentTableName): string => {
  // If it's already a document table name, get the base table name
  if (typeof entityType === 'string' && entityType.endsWith('_documents')) {
    const baseEntityType = entityType.replace('_documents', '');
    return baseEntityType + 's'; // Simple pluralization
  }
  
  // Otherwise, convert from EntityType to table name
  switch (entityType) {
    case EntityType.POLICY:
      return "policies";
    case EntityType.CLAIM:
      return "claims";
    case EntityType.CLIENT:
      return "clients";
    case EntityType.INVOICE:
      return "invoices";
    case EntityType.SALES_PROCESS:
      return "sales_processes";
    case EntityType.SALE:
      return "sales";
    case EntityType.ADDENDUM:
      return "policy_addendums";
    case EntityType.POLICY_ADDENDUM:
      return "policy_addendums";
    case EntityType.AGENT:
      return "agents";
    case EntityType.INSURER:
      return "insurers";
    default:
      if (typeof entityType === 'string') {
        return entityType.toLowerCase() + "s"; // Simple pluralization as fallback
      }
      return "unknown";
  }
};
