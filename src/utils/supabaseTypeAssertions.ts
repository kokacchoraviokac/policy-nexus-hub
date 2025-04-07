
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * A type-safe wrapper for accessing document tables
 * This ensures we get proper typing in the response
 */
export const fromDocumentTable = (tableName: DocumentTableName) => {
  // Convert DocumentTableName to a string for the query
  return supabase.from(tableName);
};

/**
 * A type-safe wrapper for general table access
 */
export const fromTable = (tableName: RelationName) => {
  // Convert RelationName to a string for the query
  return supabase.from(tableName);
};
