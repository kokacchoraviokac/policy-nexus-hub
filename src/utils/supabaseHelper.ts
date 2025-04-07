import { supabase } from "@/integrations/supabase/client";
import { DocumentTableName } from "@/types/documents";
import { fromTable } from "./supabaseTypeAssertions";

type DatabaseTableName = string;

export const safeQueryFrom = (table: DatabaseTableName) => {
  try {
    return fromTable(table);
  } catch (error) {
    console.error(`Error accessing table ${table}:`, error);
    throw new Error(`Failed to access table ${table}`);
  }
};

export const fetchRecordById = async <T>(
  tableName: string,
  id: string,
  columns = "*"
): Promise<T | null> => {
  try {
    const { data, error } = await safeQueryFrom(tableName)
      .select(columns)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Record not found
      }
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error(`Error fetching ${tableName} record:`, error);
    throw error;
  }
};

export const insertRecord = async <T>(
  tableName: string,
  record: Record<string, any>
): Promise<T> => {
  try {
    const { data, error } = await safeQueryFrom(tableName)
      .insert(record)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw error;
  }
};

export const updateRecord = async <T>(
  tableName: string,
  id: string,
  updates: Record<string, any>
): Promise<T> => {
  try {
    const { data, error } = await safeQueryFrom(tableName)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error(`Error updating ${tableName} record:`, error);
    throw error;
  }
};

// Other utility functions can be added as needed
