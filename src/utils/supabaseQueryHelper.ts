
import { supabase } from "@/integrations/supabase/client";
import { EntityType } from "@/types/documents";

// Define the valid document table names
export type DocumentTableName = 
  | 'policy_documents' 
  | 'claim_documents' 
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents';

// Define a mapping for entity types to their document tables
export const entityToDocumentTable: Record<EntityType, DocumentTableName> = {
  'policy': 'policy_documents',
  'claim': 'claim_documents', 
  'sales_process': 'sales_documents',
  'client': 'client_documents',
  'insurer': 'insurer_documents',
  'agent': 'agent_documents',
  'invoice': 'invoice_documents',
  'addendum': 'addendum_documents'
};

// Helper function to safely query document tables
export function queryDocumentTable(tableName: DocumentTableName) {
  return supabase.from(tableName as any);
}

// Type guard for DocumentTableName
export function isValidDocumentTable(tableName: string): tableName is DocumentTableName {
  return Object.values(entityToDocumentTable).includes(tableName as DocumentTableName);
}

// Helper function to determine the appropriate document table based on entity type
export function getDocumentTableForEntity(entityType: EntityType): DocumentTableName {
  // Only return valid document tables that exist in the database
  const tableName = entityToDocumentTable[entityType];
  if (tableName) return tableName;
  
  // Default fallback - should be avoided but prevents runtime errors
  console.warn(`Warning: Using default document table for unknown entity type: ${entityType}`);
  return 'policy_documents';
}

// Helper for safely querying document tables
export function queryDocuments(entityType: EntityType) {
  const tableName = getDocumentTableForEntity(entityType);
  return supabase.from(tableName as any);
}

// Helper for safely casting objects to Document type
export function castToDocument(data: any) {
  return data as any;
}

// Safe Supabase table query
export function safeSupabaseQuery(tableName: string) {
  return supabase.from(tableName as any);
}

// Helper function for document queries with any table
export function documentQuery(tableName: string) {
  return supabase.from(tableName as any);
}
