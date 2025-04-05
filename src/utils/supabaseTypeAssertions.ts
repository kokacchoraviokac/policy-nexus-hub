
import { supabase } from "@/integrations/supabase/client";
import { EntityType } from "@/types/documents";
import { DocumentTableName, getDocumentTableName } from "@/utils/documentUploadUtils";

/**
 * Helper function to safely access document tables
 * This helps work around TypeScript's deep type instantiation issues
 */
export function fromDocumentTable(tableName: string) {
  // Use type assertion to bypass TypeScript's limitations with dynamic table names
  return supabase.from(tableName as any);
}

/**
 * Helper function to safely query document table based on entity type
 */
export function queryDocumentsByEntity(entityType: EntityType, entityId: string) {
  const tableName = getDocumentTableName(entityType);
  const entityIdField = `${entityType}_id`.replace('sales_process', 'sales_process');
  
  // Create base query with type assertion
  const query = fromDocumentTable(tableName);
  
  // Add entity filter with type assertion
  return query.select('*').eq(entityIdField as any, entityId);
}

/**
 * Helper function to safely insert a document
 */
export function insertDocument(tableName: string, data: any) {
  return fromDocumentTable(tableName).insert(data);
}

/**
 * Helper function to safely update a document
 */
export function updateDocument(tableName: string, id: string, data: any) {
  return fromDocumentTable(tableName).update(data).eq('id', id);
}

/**
 * Helper function to safely delete a document
 */
export function deleteDocument(tableName: string, id: string) {
  return fromDocumentTable(tableName).delete().eq('id', id);
}

/**
 * Helper function for document type conversions to avoid TypeScript errors
 */
export function convertToDocument(data: any) {
  return data as any;
}
