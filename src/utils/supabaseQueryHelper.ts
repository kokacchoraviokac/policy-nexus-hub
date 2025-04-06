
import { supabase } from "@/integrations/supabase/client";
import { EntityType } from "@/types/common";
import { getDocumentTableName } from "@/utils/documentUploadUtils";

/**
 * Safe wrapper for Supabase queries to handle errors consistently
 */
export const safeSupabaseQuery = async <T,>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> => {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error("Supabase query error:", error);
      throw new Error(error.message || "An error occurred with the database query");
    }
    
    return data as T;
  } catch (error) {
    console.error("Error in safeSupabaseQuery:", error);
    throw error;
  }
};

// This function is a workaround for type safety in query building
export const safeQueryCast = <T = any>(value: any): T => {
  return value as T;
};

/**
 * Helper to fetch documents based on entity type and ID
 */
export const queryDocuments = async (entityType: EntityType, entityId: string) => {
  // Map entity type to the correct document table
  const documentTable = mapEntityToDocumentTable(entityType);
  
  if (!documentTable) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }
  
  // Use the safe query function to fetch documents
  try {
    // Assuming we have a type-safe query builder helper
    const response = await supabase
      .from(documentTable)
      .select("*")
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });
      
    if (response.error) {
      throw new Error(`Error fetching documents: ${response.error.message}`);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in queryDocuments:", error);
    throw error;
  }
};

/**
 * Map entity type to the corresponding document table
 */
export const mapEntityToDocumentTable = (entityType: EntityType): string => {
  return getDocumentTableName(entityType);
};

/**
 * Convert Supabase date to local format
 */
export const formatSupabaseDate = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Perform a safe query for a specific document table
 */
export const safeDocumentQuery = async <T = any>(
  entityType: EntityType,
  queryBuilder: (tableName: string) => Promise<{ data: any, error: any }>
): Promise<T> => {
  const tableName = getDocumentTableName(entityType);
  const { data, error } = await queryBuilder(tableName);
  
  if (error) {
    console.error(`Error querying ${tableName}:`, error);
    throw error;
  }
  
  return data as T;
};
