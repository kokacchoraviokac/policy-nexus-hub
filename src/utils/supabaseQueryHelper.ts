
import { supabase } from "@/integrations/supabase/client";
import { DOCUMENT_TABLES, DocumentTableName } from "@/types/documents";

/**
 * Helper function to safely query Supabase tables.
 * @param tableName Table name to query
 */
export const getTable = (tableName: string) => {
  return supabase.from(tableName);
};

/**
 * Get a document table name based on entity type
 * @param entityType Entity type
 */
export const getDocumentTableName = (entityType: string): DocumentTableName => {
  const tableName = `${entityType}_documents` as DocumentTableName;
  
  if (DOCUMENT_TABLES.includes(tableName)) {
    return tableName;
  }
  
  // Default to policy_documents if the entity type doesn't match
  console.warn(`Invalid entity type: ${entityType}, defaulting to policy_documents`);
  return 'policy_documents';
};

/**
 * Safely handle Supabase query errors
 * @param error Supabase error object
 */
export const handleQueryError = (error: any) => {
  console.error('Supabase query error:', error);
  return { error: true, message: error.message || 'An error occurred' };
};
