
import { supabase } from "@/integrations/supabase/client";

/**
 * Generic function to safely query any table with proper type assertions
 * This helps avoid TypeScript's deep type instantiation errors
 */
export function fromTable<T = any>(tableName: string) {
  // Use type assertion to avoid TypeScript limitations
  return supabase.from(tableName as any);
}

/**
 * Generic function to safely select data from a specified table
 */
export async function selectFromTable<T = any>(
  tableName: string,
  options: {
    columns?: string;
    eq?: { column: string; value: any };
    order?: { column: string; ascending?: boolean };
    limit?: number;
    single?: boolean;
  } = {}
) {
  // Create the base query
  let query = fromTable(tableName).select(options.columns || '*');
  
  // Apply filter if provided
  if (options.eq) {
    query = query.eq(options.eq.column, options.eq.value);
  }
  
  // Apply ordering if provided
  if (options.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending !== false
    });
  }
  
  // Apply limit if provided
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  // Return single item if requested
  if (options.single) {
    return await query.single();
  }
  
  return await query;
}

/**
 * Generic function to safely insert data into a specified table
 */
export async function insertIntoTable<T = any>(
  tableName: string,
  data: T,
  options: {
    returning?: boolean;
  } = { returning: true }
) {
  const query = fromTable(tableName).insert(data as any);
  
  if (options.returning) {
    return await query.select();
  }
  
  return await query;
}

/**
 * Generic function to safely update data in a specified table
 */
export async function updateInTable<T = any>(
  tableName: string,
  data: Partial<T>,
  options: {
    eq: { column: string; value: any };
    returning?: boolean;
  }
) {
  const query = fromTable(tableName)
    .update(data as any)
    .eq(options.eq.column, options.eq.value);
  
  if (options.returning !== false) {
    return await query.select();
  }
  
  return await query;
}

/**
 * Generic function to safely delete data from a specified table
 */
export async function deleteFromTable(
  tableName: string,
  options: {
    eq: { column: string; value: any };
  }
) {
  return await fromTable(tableName)
    .delete()
    .eq(options.eq.column, options.eq.value);
}
