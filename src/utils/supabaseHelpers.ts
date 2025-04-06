
import { supabase } from "@/integrations/supabase/client";
import { PostgrestQueryBuilder, PostgrestFilterBuilder } from "@supabase/postgrest-js";

/**
 * Helper function to create a query builder for a specific table
 * This helps avoid TypeScript errors with dynamic table names
 */
export function fromTable(tableName: string) {
  // Use type assertion to handle dynamic table names
  return supabase.from(tableName as any);
}

/**
 * Safe query builder that handles string table names properly 
 */
export function safeFrom(tableName: string) {
  // Use type assertion to handle dynamic table names
  return supabase.from(tableName as any);
}

/**
 * Creates a filter query for dynamic table names
 */
export function filterQuery(tableName: string, filterColumn: string, value: any) {
  const query = safeFrom(tableName);
  // Cast to any to avoid TypeScript errors with dynamic methods
  return (query as any).eq(filterColumn, value);
}

/**
 * Creates a search query for dynamic table names
 */
export function searchQuery(tableName: string, column: string, searchTerm: string) {
  const query = safeFrom(tableName);
  // Cast to any to avoid TypeScript errors with dynamic methods
  return (query as any).ilike(String(column), `%${searchTerm}%`);
}

/**
 * Creates a sort query for dynamic table names
 */
export function sortQuery(tableName: string, column: string, direction: 'asc' | 'desc' = 'asc') {
  const query = safeFrom(tableName);
  // Cast to any to avoid TypeScript errors with dynamic methods
  return (query as any).order(String(column), { ascending: direction === 'asc' });
}

/**
 * Helper to safely cast query results to a specific type
 */
export function safeQueryCast<T>(data: any): T {
  return data as T;
}

/**
 * Safe wrapper for supabase queries with dynamic table names
 */
export function executeQuery<T = any>(tableName: string, queryFn: (query: PostgrestQueryBuilder<any, any, string>) => any): Promise<{ data: T, error: any }> {
  try {
    const query = safeFrom(tableName);
    return queryFn(query as any);
  } catch (error) {
    console.error(`Error executing query on ${tableName}:`, error);
    return Promise.resolve({ data: null, error: errorToString(error) });
  }
}

/**
 * Helper to safely cast error to string
 */
export function errorToString(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
