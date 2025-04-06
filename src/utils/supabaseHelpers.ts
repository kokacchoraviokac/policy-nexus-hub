
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Helper function to extract table name from entity type
export function getTableNameFromEntityType(entityType: string): string {
  const tableMappings: Record<string, string> = {
    'policy': 'policy_documents',
    'claim': 'claim_documents',
    'sales_process': 'sales_documents',
    'client': 'client_documents',
    'insurer': 'insurer_documents',
    'agent': 'agent_documents',
    'addendum': 'addendum_documents',
    'invoice': 'invoice_documents',
    'sale': 'sales_documents', // Alias for sales_process
  };
  
  return tableMappings[entityType] || `${entityType}_documents`;
}

// Function to safely convert symbol to string
export function convertSymbolToString(symbol: symbol | string): string {
  if (typeof symbol === 'symbol') {
    return String(symbol);
  }
  return symbol;
}

// Generic function to paginate results
export async function paginateQuery<T>(
  query: any,
  page = 1,
  pageSize = 10
): Promise<{ data: T[]; count: number }> {
  try {
    // Get count first
    const countQuery = query.clone();
    const { count, error: countError } = await countQuery.count();
    
    if (countError) throw countError;
    
    // Add pagination to original query
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error } = await query
      .range(from, to);
    
    if (error) throw error;
    
    return { data: data || [], count };
  } catch (error) {
    console.error('Error paginating query:', error);
    return { data: [], count: 0 };
  }
}

// Function to execute safely from table
export async function safeFromTable(
  client: SupabaseClient,
  table: string | symbol,
  options?: { select?: string }
) {
  const tableName = typeof table === 'symbol' ? String(table) : table;
  let query = client.from(tableName);
  
  if (options?.select) {
    query = query.select(options.select);
  }
  
  return query;
}

// Function to create a generic filter builder
export function buildFilteredQuery(
  client: SupabaseClient,
  table: string | symbol,
  filters: Record<string, any>,
  options?: { select?: string; order?: { column: string; ascending?: boolean } }
) {
  const tableName = typeof table === 'symbol' ? String(table) : table;
  let query = client.from(tableName);
  
  if (options?.select) {
    query = query.select(options.select);
  }
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string' && value.includes('%')) {
        query = query.ilike(key, value);
      } else {
        query = query.eq(key, value);
      }
    }
  });
  
  // Apply ordering
  if (options?.order) {
    const { column, ascending = true } = options.order;
    query = query.order(column, { ascending });
  }
  
  return query;
}

// Function to create entity with safe error handling
export async function createEntitySafely<T>(
  client: SupabaseClient,
  table: string | symbol,
  data: Partial<T>
): Promise<T | null> {
  try {
    const tableName = typeof table === 'symbol' ? String(table) : table;
    const { data: createdData, error } = await client
      .from(tableName)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return createdData as T;
  } catch (error) {
    console.error(`Error creating entity in ${String(table)}:`, error);
    return null;
  }
}

// Function to update entity with safe error handling
export async function updateEntitySafely<T>(
  client: SupabaseClient,
  table: string | symbol,
  id: string,
  data: Partial<T>
): Promise<T | null> {
  try {
    const tableName = typeof table === 'symbol' ? String(table) : table;
    const { data: updatedData, error } = await client
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedData as T;
  } catch (error) {
    console.error(`Error updating entity in ${String(table)}:`, error);
    return null;
  }
}
