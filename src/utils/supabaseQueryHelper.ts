
import { supabase } from "@/integrations/supabase/client";
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';

// Define the valid document table names
export type DocumentTableName = 
  | 'policy_documents' 
  | 'claim_documents' 
  | 'sales_documents';

// Define a mapping for entity types to their document tables
export const entityToDocumentTable: Record<string, DocumentTableName> = {
  'policy': 'policy_documents',
  'claim': 'claim_documents', 
  'sales_process': 'sales_documents'
};

// Helper function to safely query document tables
export function queryDocumentTable(tableName: DocumentTableName) {
  // This is a type-safe way to query these specific tables
  return supabase.from(tableName);
}

// Type guard for DocumentTableName
export function isValidDocumentTable(tableName: string): tableName is DocumentTableName {
  return Object.values(entityToDocumentTable).includes(tableName as DocumentTableName);
}

// Helper function to determine the appropriate document table based on entity type
export function getDocumentTableForEntity(entityType: string): DocumentTableName {
  // Only return valid document tables that exist in the database
  const tableName = entityToDocumentTable[entityType];
  if (tableName) return tableName;
  
  // Default fallback - should be avoided but prevents runtime errors
  console.warn(`Warning: Using default document table for unknown entity type: ${entityType}`);
  return 'policy_documents';
}

// Helper for safely querying document tables
export function queryDocuments(entityType: string) {
  const tableName = getDocumentTableForEntity(entityType);
  return supabase.from(tableName);
}

// Helper for safely casting objects to Document type
export function castToDocument(data: any) {
  return data;
}
