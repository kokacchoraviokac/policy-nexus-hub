
import { supabase } from "@/integrations/supabase/client";
import { EntityType, DocumentTableName, DOCUMENT_TABLES } from "@/types/documents";

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

/**
 * Get document table for entity - used for document searches
 */
export function getDocumentTableForEntity(entityType: EntityType): DocumentTableName {
  return entityToDocumentTable[entityType];
}

/**
 * Helper to query documents by entity type
 */
export function queryDocuments(entityType: EntityType) {
  const tableName = getDocumentTableName(entityType);
  return fromTable(tableName);
}

/**
 * Helper for safe Supabase queries with dynamic table names
 */
export function fromTable(tableName: string) {
  // We need to use type assertion to handle dynamic table names
  return supabase.from(tableName as any);
}

/**
 * A safer wrapper for Supabase queries that works with dynamic table names
 * by using type assertions to avoid TypeScript errors
 */
export function safeSupabaseQuery(tableName: string) {
  // Use type assertion to avoid TypeScript limitations with dynamic table names
  return supabase.from(tableName as any);
}
