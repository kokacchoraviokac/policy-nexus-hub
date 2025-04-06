
import { EntityType } from "@/types/documents";

// Map entity types to their corresponding document table names
export const entityToDocumentTable: Record<EntityType, string> = {
  policy: "policy_documents",
  claim: "claim_documents",
  sales_process: "sales_documents",
  sale: "sales_documents", // Alias for backward compatibility
  client: "client_documents",
  insurer: "insurer_documents",
  agent: "agent_documents",
  invoice: "invoice_documents",
  addendum: "addendum_documents"
};

/**
 * Get the document table name for a specific entity type
 */
export function getDocumentTableName(entityType: EntityType): string {
  return entityToDocumentTable[entityType];
}

/**
 * Get entity type from document table name
 */
export function getEntityTypeFromTable(tableName: string): EntityType {
  const entries = Object.entries(entityToDocumentTable);
  const match = entries.find(([_entityType, docTableName]) => docTableName === tableName);
  
  if (!match) {
    // Default to policy as fallback
    console.warn(`No entity type found for table: ${tableName}, defaulting to 'policy'`);
    return "policy";
  }
  
  return match[0] as EntityType;
}

/**
 * Utility interface for document upload options
 */
export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category: string;
  entityType: EntityType;
  entityId: string;
  originalDocumentId?: string | null;
  currentVersion?: number;
  salesStage?: string;
  description?: string;
}
