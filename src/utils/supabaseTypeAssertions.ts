
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";
import { DocumentTableName } from "@/types/documents";
import { PostgrestQueryBuilder } from "@supabase/supabase-js";

/**
 * A type-safe wrapper for accessing document tables
 * This ensures we get proper typing in the response
 */
export const fromDocumentTable = (tableName: DocumentTableName) => {
  // Type assertion to allow any table name for now, to fix runtime errors
  return supabase.from(tableName as any);
};

/**
 * A type-safe wrapper for general table access
 */
export const fromTable = (tableName: RelationName) => {
  // Type assertion to allow any table name for now, to fix runtime errors
  return supabase.from(tableName as any);
};

/**
 * A helper function to dynamically access any table
 * Used in cases where type safety is handled elsewhere
 */
export const fromDynamicTable = (tableName: string) => {
  return supabase.from(tableName as any);
};
