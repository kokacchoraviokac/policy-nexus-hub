
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { getErrorMessage } from '@/utils/errorHandling';

/**
 * A hook that provides a safely typed wrapper around Supabase queries
 */
export function useSupabaseQuery() {
  /**
   * Safely execute a query against any Supabase table
   */
  const executeQuery = useCallback(async <T>(
    tableName: string,
    queryBuilder: (query: any) => any,
  ): Promise<{ data: T[] | null; error: PostgrestError | Error | null }> => {
    try {
      // Cast to any to bypass TypeScript's strict typing for table names
      const baseQuery = supabase.from(tableName as any);
      const { data, error } = await queryBuilder(baseQuery);
      
      if (error) {
        return { data: null, error };
      }
      
      return { data: data as T[], error: null };
    } catch (error) {
      return {
        data: null,
        error: new Error(getErrorMessage(error))
      };
    }
  }, []);

  /**
   * Safely insert data into any Supabase table
   */
  const insertData = useCallback(async <T>(
    tableName: string,
    data: any,
  ): Promise<{ data: T | null; error: PostgrestError | Error | null }> => {
    try {
      // Cast to any to bypass TypeScript's strict typing for table names
      const { data: result, error } = await (supabase.from(tableName as any)
        .insert(data)
        .select('*')
        .single());
      
      if (error) {
        return { data: null, error };
      }
      
      return { data: result as T, error: null };
    } catch (error) {
      return {
        data: null,
        error: new Error(getErrorMessage(error))
      };
    }
  }, []);

  /**
   * Safely update data in any Supabase table
   */
  const updateData = useCallback(async <T>(
    tableName: string,
    id: string,
    data: any,
  ): Promise<{ data: T | null; error: PostgrestError | Error | null }> => {
    try {
      // Cast to any to bypass TypeScript's strict typing for table names
      const { data: result, error } = await (supabase.from(tableName as any)
        .update(data)
        .eq('id', id)
        .select('*')
        .single());
      
      if (error) {
        return { data: null, error };
      }
      
      return { data: result as T, error: null };
    } catch (error) {
      return {
        data: null,
        error: new Error(getErrorMessage(error))
      };
    }
  }, []);

  /**
   * Safely delete data from any Supabase table
   */
  const deleteData = useCallback(async (
    tableName: string,
    id: string,
  ): Promise<{ error: PostgrestError | Error | null }> => {
    try {
      // Cast to any to bypass TypeScript's strict typing for table names
      const { error } = await (supabase.from(tableName as any)
        .delete()
        .eq('id', id));
      
      return { error };
    } catch (error) {
      return {
        error: new Error(getErrorMessage(error))
      };
    }
  }, []);

  return {
    executeQuery,
    insertData,
    updateData,
    deleteData
  };
}
