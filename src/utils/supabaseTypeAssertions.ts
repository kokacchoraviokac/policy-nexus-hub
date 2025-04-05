
import { supabase } from "@/integrations/supabase/client";
import { DocumentTableName } from "@/utils/documentUploadUtils";

/**
 * A wrapper for the supabase.from() function that helps with Typescript errors
 * by applying a type assertion. This is not as type-safe as proper schema types,
 * but helps avoid TypeScript errors in the codebase.
 * 
 * @param tableName The name of the table to query
 * @returns A PostgrestQueryBuilder for the specified table
 */
export function safeFrom(tableName: string) {
  return supabase.from(tableName as any);
}

/**
 * A wrapper specifically for document tables to ensure we're using
 * a consistent approach to accessing them
 */
export function fromDocumentTable(tableName: DocumentTableName) {
  // This type assertion tells TypeScript to trust that this is a valid table name
  return supabase.from(tableName as any);
}
