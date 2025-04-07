
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * A type-safe wrapper for accessing document tables
 * This ensures we get proper typing in the response
 */
export const fromDocumentTable = (tableName: DocumentTableName) => {
  // Since we can't directly type-check at runtime, we need to trust the type system
  // And use a more flexible approach with the Supabase client
  return supabase.from(tableName as string);
};

/**
 * A type-safe wrapper for general table access
 */
export const fromTable = (tableName: RelationName) => {
  // Again, we trust TypeScript to validate the table name
  // and let any runtime errors be caught by the Supabase client
  return supabase.from(tableName as string);
};
