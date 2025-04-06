
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to create a query builder for a specific table
 * This helps avoid TypeScript errors with dynamic table names
 */
export function fromTable(tableName: string) {
  return supabase.from(tableName);
}

/**
 * Safe query builder that handles string table names properly 
 */
export function safeFrom(tableName: string) {
  return supabase.from(tableName);
}

/**
 * Creates a filter query for dynamic table names
 */
export function filterQuery(tableName: string, filterColumn: string, value: any) {
  const query = safeFrom(tableName);
  return query.eq(filterColumn, value);
}

/**
 * Creates a search query for dynamic table names
 */
export function searchQuery(tableName: string, column: string, searchTerm: string) {
  const query = safeFrom(tableName);
  return query.ilike(String(column), `%${searchTerm}%`);
}

/**
 * Creates a sort query for dynamic table names
 */
export function sortQuery(tableName: string, column: string, direction: 'asc' | 'desc' = 'asc') {
  const query = safeFrom(tableName);
  return query.order(String(column), { ascending: direction === 'asc' });
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
export function executeQuery(tableName: string, queryFn: (query: any) => any) {
  try {
    const query = safeFrom(tableName);
    return queryFn(query);
  } catch (error) {
    console.error(`Error executing query on ${tableName}:`, error);
    throw error;
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
