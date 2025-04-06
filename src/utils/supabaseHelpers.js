
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to create a query builder for a specific table
 * This helps avoid TypeScript errors with dynamic table names
 */
export function fromTable(tableName) {
  return supabase.from(tableName);
}

// Export other helpers that might be needed
export * from './supabaseHelpers.ts';
