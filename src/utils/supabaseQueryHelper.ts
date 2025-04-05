
import { EntityType } from "@/types/documents";

// Map entity types to their corresponding document table names
export const entityToDocumentTable: Record<EntityType, DocumentTableName> = {
  policy: "policy_documents",
  claim: "claim_documents",
  sales_process: "sales_documents",
  client: "client_documents",
  insurer: "insurer_documents",
  agent: "agent_documents",
  invoice: "invoice_documents",
  addendum: "addendum_documents"
};

// Define the allowed document table names
export type DocumentTableName = 
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

/**
 * Get the document table name for a specific entity type
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
  return entityToDocumentTable[entityType];
}

/**
 * Get entity type from document table name
 */
export function getEntityTypeFromTable(tableName: DocumentTableName): EntityType {
  const entries = Object.entries(entityToDocumentTable);
  const match = entries.find(([_entityType, docTableName]) => docTableName === tableName);
  
  if (!match) {
    // Default to policy as fallback
    console.warn(`No entity type found for table: ${tableName}, defaulting to 'policy'`);
    return "policy";
  }
  
  return match[0] as EntityType;
}
