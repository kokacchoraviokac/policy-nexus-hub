
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * A type-safe wrapper for accessing document tables
 * This ensures we get proper typing in the response
 */
export const fromDocumentTable = (tableName: DocumentTableName) => {
  // Use type assertion to ensure TypeScript treats this as a valid table name
  return supabase.from(tableName as RelationName);
};

/**
 * A type-safe wrapper for general table access
 */
export const fromTable = (tableName: RelationName) => {
  // Use RelationName which includes all valid table names
  return supabase.from(tableName);
};
