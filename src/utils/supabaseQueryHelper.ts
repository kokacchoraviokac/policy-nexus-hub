
import { supabase } from "@/integrations/supabase/client";
import { DOCUMENT_TABLES, DocumentTableName } from "@/types/documents";

/**
 * Helper function to safely query Supabase tables.
 * @param tableName Table name to query
 */
export const getTable = (tableName: string) => {
  // Use type assertion to handle string-based table names
  return supabase.from(tableName as any);
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

/**
 * Helper function to query documents from Supabase
 * @param tableName Document table name
 * @param filters Query filters
 */
export const queryDocuments = async (tableName: DocumentTableName, filters: any = {}) => {
  try {
    // Use type assertion to handle table name
    let query = supabase.from(tableName as any).select('*');
    
    // Apply filters
    if (filters.entityId) {
      query = query.eq(filters.entityIdField || 'entity_id', filters.entityId);
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.order) {
      query = query.order(filters.order.column, filters.order.options);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error querying ${tableName}:`, error);
    return [];
  }
};

/**
 * Helper function for safe Supabase queries with error handling
 */
export const safeSupabaseQuery = async (queryFn: () => Promise<any>) => {
  try {
    const result = await queryFn();
    if (result.error) {
      console.error('Supabase query error:', result.error);
      return { error: result.error, data: null };
    }
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Supabase query exception:', error);
    return { error, data: null };
  }
};
