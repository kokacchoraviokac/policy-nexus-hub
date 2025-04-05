
import { supabase } from "@/integrations/supabase/client";
import { ServiceResponse } from "@/types/services";
import { handleApiErrorMessage } from "./errorHandling";

/**
 * A type-safe wrapper for Supabase queries
 * @param query Function to execute the Supabase query
 * @returns A service response with data or error
 */
export async function executeSupabaseQuery<T>(
  query: () => Promise<{ data: any; error: any }>
): Promise<ServiceResponse<T>> {
  try {
    const { data, error } = await query();
    
    if (error) throw error;
    
    return { success: true, data: data as T };
  } catch (error) {
    console.error("Supabase query error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(handleApiErrorMessage(error)) 
    };
  }
}

/**
 * A helper for type-safe table operations
 * @param tableName The table to query
 * @returns An object with type-safe query methods
 */
export function createTableHelper<T>(tableName: string) {
  return {
    getById: async (id: string): Promise<ServiceResponse<T>> => {
      return executeSupabaseQuery<T>(async () => {
        return supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();
      });
    },
    
    getAll: async (options?: {
      filters?: Record<string, any>;
      orderBy?: string;
      ascending?: boolean;
      limit?: number;
    }): Promise<ServiceResponse<T[]>> => {
      return executeSupabaseQuery<T[]>(async () => {
        let query = supabase.from(tableName).select('*');
        
        // Apply filters
        if (options?.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          });
        }
        
        // Apply ordering
        if (options?.orderBy) {
          query = query.order(options.orderBy, { 
            ascending: options.ascending ?? true 
          });
        }
        
        // Apply limit
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        return query;
      });
    },
    
    insert: async (data: Partial<T>): Promise<ServiceResponse<T>> => {
      return executeSupabaseQuery<T>(async () => {
        return supabase
          .from(tableName)
          .insert(data as any)
          .select()
          .single();
      });
    },
    
    update: async (id: string, data: Partial<T>): Promise<ServiceResponse<T>> => {
      return executeSupabaseQuery<T>(async () => {
        return supabase
          .from(tableName)
          .update(data as any)
          .eq('id', id)
          .select()
          .single();
      });
    },
    
    delete: async (id: string): Promise<ServiceResponse<null>> => {
      return executeSupabaseQuery<null>(async () => {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);
          
        return { data: null, error };
      });
    }
  };
}
