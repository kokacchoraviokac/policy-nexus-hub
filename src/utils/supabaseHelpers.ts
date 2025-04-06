
import { supabase } from "@/integrations/supabase/client";

/**
 * Generic function to safely query any table with proper type assertions
 * This helps avoid TypeScript's deep type instantiation errors
 */
export function fromTable<T = any>(tableName: string) {
  return supabase.from(tableName);
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
  let query = fromTable<T>(tableName).select(options.columns || '*');
  
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
  
  // Execute the query
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error querying ${tableName}:`, error);
    throw new Error(`Database query failed: ${error.message}`);
  }
  
  // Return single item if requested
  if (options.single && data && data.length > 0) {
    return data[0] as T;
  }
  
  return data as T[];
}

/**
 * Generic function to safely insert data into a specified table
 */
export async function insertIntoTable<T = any>(
  tableName: string,
  data: any,
  options: {
    returning?: boolean;
  } = { returning: true }
) {
  const query = fromTable<T>(tableName).insert(data);
  
  if (options.returning) {
    const { data: result, error } = await query.select();
    
    if (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      throw new Error(`Database insert failed: ${error.message}`);
    }
    
    return result as T[];
  }
  
  const { error } = await query;
  
  if (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw new Error(`Database insert failed: ${error.message}`);
  }
  
  return null;
}

/**
 * Generic function to safely update data in a specified table
 */
export async function updateInTable<T = any>(
  tableName: string,
  data: any,
  options: {
    eq: { column: string; value: any };
    returning?: boolean;
  }
) {
  const query = fromTable<T>(tableName)
    .update(data)
    .eq(options.eq.column, options.eq.value);
  
  if (options.returning !== false) {
    const { data: result, error } = await query.select();
    
    if (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw new Error(`Database update failed: ${error.message}`);
    }
    
    return result as T[];
  }
  
  const { error } = await query;
  
  if (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw new Error(`Database update failed: ${error.message}`);
  }
  
  return null;
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
  const { error } = await fromTable(tableName)
    .delete()
    .eq(options.eq.column, options.eq.value);
    
  if (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    throw new Error(`Database delete failed: ${error.message}`);
  }
  
  return true;
}
