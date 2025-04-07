
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * A type-safe wrapper for accessing document tables
 * This ensures we get proper typing in the response
 */
export const fromDocumentTable = (tableName: DocumentTableName) => {
  // Since we can't directly type-check at runtime, we'll use a direct approach
  // and trust that the tableName is valid based on the type system
  return supabase.from(tableName);
};

/**
 * A type-safe wrapper for general table access
 */
export const fromTable = (tableName: RelationName) => {
  // Again, we trust TypeScript to validate the table name and let any runtime
  // errors be caught by the Supabase client
  return supabase.from(tableName);
};
