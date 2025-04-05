
import { supabase } from "@/integrations/supabase/client";
import { DocumentTableName } from "@/utils/documentUploadUtils";

/**
 * Helper function to safely query document tables
 * This works around TypeScript limitations with dynamic table names
 */
export function queryDocumentTable(tableName: DocumentTableName) {
  return supabase.from(tableName) as any;
}

/**
 * Helper for safely casting objects to Document type
 */
export function castToDocument(data: any) {
  return data as any;
}
