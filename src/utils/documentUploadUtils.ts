
import { EntityType } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * Maps entity types to their corresponding document table names
 */
export function getDocumentTableName(entityType: EntityType | string): DocumentTableName {
  const mapping: Record<string, DocumentTableName> = {
    [EntityType.POLICY]: "policy_documents",
    [EntityType.CLAIM]: "claim_documents",
    [EntityType.SALES_PROCESS]: "sales_documents",
    [EntityType.SALE]: "sales_documents", // Alias for sales_process
    [EntityType.CLIENT]: "client_documents",
    [EntityType.INSURER]: "insurer_documents",
    [EntityType.AGENT]: "agent_documents",
    [EntityType.INVOICE]: "invoice_documents",
    [EntityType.ADDENDUM]: "addendum_documents",
  };

  const tableName = mapping[entityType];
  if (!tableName) {
    console.warn(`Unknown entity type: ${entityType}, defaulting to policy_documents`);
    return "policy_documents";
  }

  return tableName;
}

/**
 * Maps entity types to their corresponding ID column names in document tables
 */
export function getEntityIdColumn(entityType: EntityType | string): string {
  const mapping: Record<string, string> = {
    [EntityType.POLICY]: "policy_id",
    [EntityType.CLAIM]: "claim_id",
    [EntityType.SALES_PROCESS]: "sales_process_id",
    [EntityType.SALE]: "sales_process_id", // Alias for sales_process
    [EntityType.CLIENT]: "client_id",
    [EntityType.INSURER]: "insurer_id",
    [EntityType.AGENT]: "agent_id",
    [EntityType.INVOICE]: "invoice_id",
    [EntityType.ADDENDUM]: "addendum_id",
  };

  const columnName = mapping[entityType];
  if (!columnName) {
    console.warn(`Unknown entity type: ${entityType}, defaulting to entity_id`);
    return "entity_id";
  }

  return columnName;
}
