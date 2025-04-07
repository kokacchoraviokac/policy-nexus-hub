
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";

/**
 * A type-safe wrapper for accessing document tables
 * This ensures we get proper typing in the response
 */
export const fromDocumentTable = (tableName: RelationName) => {
  return supabase.from(tableName);
};

/**
 * A type-safe wrapper for general table access
 */
export const fromTable = (tableName: string) => {
  return supabase.from(tableName);
};
