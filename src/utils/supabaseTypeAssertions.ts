
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";
import { PostgrestQueryBuilder } from "@supabase/postgrest-js";

/**
 * A safer way to perform a FROM operation on tables with proper type checking
 * Use when you need to access a table that is in the RelationName type
 * 
 * @param tableName The name of the table to query
 * @returns A PostgrestQueryBuilder with the correct table context
 */
export function fromDocumentTable(tableName: RelationName): PostgrestQueryBuilder<any, any, any> {
  // Use a type assertion to handle the situation where Supabase expects an exact string literal
  return supabase.from(tableName as any);
}

/**
 * Alternative name for fromDocumentTable for use in other contexts
 */
export const fromTable = fromDocumentTable;

/**
 * Cast an unknown type (usually from a database query) to a specific type
 * This does not perform any runtime validation - it's just a TypeScript helper
 * 
 * @param data The data to cast
 * @returns The same data but with the specified type
 */
export function castDocumentData<T>(data: unknown): T {
  return data as T;
}

/**
 * Safe wrapper for Supabase's storage.from() function
 * 
 * @param bucketName The name of the storage bucket
 * @returns The storage bucket
 */
export function fromStorageBucket(bucketName: string) {
  return supabase.storage.from(bucketName);
}

/**
 * A safer way to perform database-wide operations with proper type checking
 * Use when you need to access a specific table for CRUD operations
 * 
 * @param tableName The name of the table to query
 * @returns A PostgrestQueryBuilder with the correct table context
 */
export function fromDatabaseTable(tableName: RelationName): PostgrestQueryBuilder<any, any, any> {
  // Use a type assertion to handle the situation where Supabase expects an exact string literal
  return supabase.from(tableName as any);
}

/**
 * Safely handle Supabase errors by converting them to a standard format
 * 
 * @param error The error from Supabase
 * @returns A standardized error message
 */
export function handleSupabaseError(error: any): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.details) return error.details;
  if (error?.error_description) return error.error_description;
  return 'An unknown error occurred';
}
