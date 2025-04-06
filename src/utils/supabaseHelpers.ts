
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to safely cast table names for supabase operations
 * To avoid TypeScript errors when using dynamic table names
 */
export function getTable(tableName: string) {
  return supabase.from(tableName as any);
}

/**
 * Get a record by ID from any table
 */
export async function getById(table: string, id: string) {
  const { data, error } = await getTable(table)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching ${table} by ID:`, error);
    throw error;
  }

  return data;
}

/**
 * Get all records from any table with optional filtering
 */
export async function getAll(table: string, filters?: Record<string, any>) {
  let query = getTable(table).select("*");

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching all ${table}:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Search records in any table by text field
 */
export async function searchByField(
  table: string,
  field: string,
  searchTerm: string
) {
  const { data, error } = await getTable(table)
    .select("*")
    .ilike(field, `%${searchTerm}%`);

  if (error) {
    console.error(`Error searching ${table} by ${field}:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Get records by foreign key reference
 */
export async function getByForeignKey(
  table: string,
  foreignKey: string,
  foreignValue: string
) {
  const { data, error } = await getTable(table)
    .select("*")
    .eq(foreignKey, foreignValue);

  if (error) {
    console.error(`Error fetching ${table} by ${foreignKey}:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Get records with pagination and sorting
 */
export async function getPaginated(
  table: string,
  page = 1,
  pageSize = 10,
  sortField = "created_at",
  sortDirection: "asc" | "desc" = "desc",
  filters?: Record<string, any>
) {
  // Calculate range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Start building query
  let query = getTable(table).select("*", { count: "exact" });

  // Apply filters if provided
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }
  }

  // Apply ordering and pagination
  query = query.order(sortField, { ascending: sortDirection === "asc" }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error(`Error fetching paginated ${table}:`, error);
    throw error;
  }

  return {
    data: data || [],
    totalCount: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Create a new record in any table
 */
export async function create(table: string, data: any) {
  const { data: result, error } = await getTable(table)
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error(`Error creating record in ${table}:`, error);
    throw error;
  }

  return result;
}

/**
 * Update a record in any table
 */
export async function update(table: string, id: string, data: any) {
  const { data: result, error } = await getTable(table)
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating record in ${table}:`, error);
    throw error;
  }

  return result;
}

/**
 * Delete a record from any table
 */
export async function remove(table: string, id: string) {
  const { error } = await getTable(table).delete().eq("id", id);

  if (error) {
    console.error(`Error deleting record from ${table}:`, error);
    throw error;
  }

  return true;
}

/**
 * Convert error object to string for user-friendly messages
 */
export function errorToString(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
