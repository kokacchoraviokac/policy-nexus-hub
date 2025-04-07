
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * A type-safe wrapper for accessing document tables
 * This ensures we get proper typing in the response
 */
export const fromDocumentTable = (tableName: DocumentTableName) => {
  // Map the document table name to the correctly typed RelationName
  const relationName = tableName as unknown as RelationName;
  return supabase.from(relationName);
};

/**
 * A type-safe wrapper for general table access
 */
export const fromTable = (tableName: string) => {
  return supabase.from(tableName as unknown as RelationName);
};
