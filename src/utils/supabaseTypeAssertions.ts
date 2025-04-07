
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * A type-safe wrapper for accessing document tables
 * This ensures we get proper typing in the response
 */
export const fromDocumentTable = (tableName: DocumentTableName) => {
  // We're using an explicit any here to overcome TypeScript's limitation
  // with string literal types that should be compatible but TypeScript sees as different
  return supabase.from(tableName as any);
};

/**
 * A type-safe wrapper for general table access
 */
export const fromTable = (tableName: RelationName) => {
  // Using any to avoid TypeScript's limitation with string literal union types
  return supabase.from(tableName as any);
};
