
import { supabase } from "@/integrations/supabase/client";
import { DocumentTableName } from "@/types/documents";

/**
 * Helper function to create a type-safe query builder for document tables
 */
export function fromDocumentTable(tableName: DocumentTableName) {
  return supabase.from(tableName);
}

/**
 * Helper function to create a type-safe query builder for any table
 * Use with caution as it bypasses TypeScript's type checking
 */
export function fromAnyTable(tableName: string) {
  // Using type assertion to allow any string
  return supabase.from(tableName as any);
}

/**
 * Get storage URL for a file path
 */
export function getStorageUrl(bucket: string, filePath: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
