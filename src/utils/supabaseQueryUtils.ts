
import { supabase } from "@/integrations/supabase/client";
import { DocumentTableName } from "@/types/documents";
import { EntityType } from "@/types/common";
import { getDocumentTableName } from "./documentUploadUtils";

/**
 * Safely execute document-related queries with proper type handling
 */
export async function executeDocumentQuery<T>(
  entityType: EntityType,
  builder: (tableName: string) => Promise<{ data: any; error: any }>
): Promise<T | null> {
  try {
    // Get the correct table name
    const tableName = getDocumentTableName(entityType);
    
    // Execute the query
    const { data, error } = await builder(tableName);
    
    if (error) {
      console.error(`Error executing document query for ${entityType}:`, error);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Error in executeDocumentQuery:`, error);
    return null;
  }
}

/**
 * Convert a table name to the corresponding Supabase table type
 * This helps TypeScript understand the type of data being returned
 */
export function getSupabaseTable(tableName: DocumentTableName | string) {
  // Using a type assertion to tell TypeScript this is a valid table
  return supabase.from(tableName as any);
}

/**
 * Safely handle Supabase document operations with proper error handling
 */
export async function safeDocumentOperation<T>(
  operation: () => Promise<{ data: any; error: any }>,
  errorMessage = "Error performing document operation"
): Promise<T | null> {
  try {
    const { data, error } = await operation();
    
    if (error) {
      console.error(errorMessage, error);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}
