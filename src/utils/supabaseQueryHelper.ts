
import { supabase } from "@/integrations/supabase/client";
import { EntityType } from "@/types/documents";
import { safeQueryCast } from "@/utils/safeSupabaseQuery";
import { fromTable } from "@/utils/supabaseTypeAssertions";

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
    const { data, error } = await fromTable(documentTable)
      .select("*")
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });
      
    if (error) {
      throw new Error(`Error fetching documents: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error("Error in queryDocuments:", error);
    throw error;
  }
};

/**
 * Map entity type to the corresponding document table
 */
export const mapEntityToDocumentTable = (entityType: EntityType): string => {
  const mapping: Record<EntityType, string> = {
    "policy": "policy_documents",
    "claim": "claim_documents",
    "sale": "sales_documents",
    "sales_process": "sales_documents",
    "client": "client_documents",
    "insurer": "insurer_documents",
    "agent": "agent_documents",
    "invoice": "invoice_documents",
    "addendum": "addendum_documents"
  };
  
  return mapping[entityType] || "";
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
