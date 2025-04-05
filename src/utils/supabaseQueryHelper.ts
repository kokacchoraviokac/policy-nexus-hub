
import { supabase } from "@/integrations/supabase/client";
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';

// Define the valid document table names
export type DocumentTableName = 
  | 'policy_documents' 
  | 'claim_documents' 
  | 'sales_documents';

// Define a mapping for entity types to their document tables
export const entityToDocumentTable = {
  'policy': 'policy_documents',
  'claim': 'claim_documents', 
  'sales_process': 'sales_documents'
} as const;

// Helper function to safely query document tables
export function queryDocumentTable(tableName: DocumentTableName) {
  // This is a type-safe way to query these specific tables
  return supabase.from(tableName);
}

// Helper function to determine the appropriate document table based on entity type
export function getDocumentTableForEntity(entityType: string): DocumentTableName {
  // Only return valid document tables that exist in the database
  if (entityType === 'policy') return 'policy_documents';
  if (entityType === 'claim') return 'claim_documents';
  if (entityType === 'sales_process') return 'sales_documents';
  
  // Default fallback - should be avoided but prevents runtime errors
  console.warn(`Warning: Using default document table for unknown entity type: ${entityType}`);
  return 'policy_documents';
}

// Helper for safely casting objects to Document type
export function castToDocument(data: any) {
  return data;
}
