
import { supabase } from '@/integrations/supabase/client';
import { DatabaseTableName, RelationName } from '@/types/supabase';

/**
 * Type-safe function to get a Supabase query builder for any table
 */
export const fromTable = (tableName: DatabaseTableName) => {
  return supabase.from(tableName);
};

/**
 * Type-safe alias for backward compatibility
 */
export const fromAnyTable = fromTable;

/**
 * Helper to make dynamic table queries safer
 */
export async function safeQuery<T = any>(
  tableName: DatabaseTableName,
  queryFn: (queryBuilder: ReturnType<typeof fromTable>) => Promise<{ data: any; error: any }>
): Promise<T[]> {
  try {
    const queryBuilder = fromTable(tableName);
    const { data, error } = await queryFn(queryBuilder);
    
    if (error) {
      console.error(`Error querying ${tableName}:`, error);
      throw error;
    }
    
    return data as T[];
  } catch (error) {
    console.error(`Error in safeQuery for ${tableName}:`, error);
    throw error;
  }
}

/**
 * Helper to safely execute a dynamic table query
 */
export async function executeQuery<T = any>(
  tableName: DatabaseTableName,
  queryFn: (queryBuilder: ReturnType<typeof fromTable>) => Promise<{ data: any; error: any }>
): Promise<{ data: T | null; error: any }> {
  try {
    const queryBuilder = fromTable(tableName);
    const result = await queryFn(queryBuilder);
    return result as { data: T | null; error: any };
  } catch (error) {
    console.error(`Error executing query on ${tableName}:`, error);
    return { data: null, error: error };
  }
}

/**
 * Check if a table name is valid
 */
export function isValidTableName(tableName: string): tableName is DatabaseTableName {
  const validTableNames: DatabaseTableName[] = [
    'policy_documents',
    'claim_documents',
    'sales_documents',
    'client_documents',
    'insurer_documents',
    'agent_documents',
    'addendum_documents',
    'invoice_documents',
    'activity_logs',
    'agent_payouts',
    'agents',
    'bank_statements',
    'bank_transactions',
    'claims',
    'client_commissions',
    'clients',
    'commissions',
    'companies',
    'company_email_settings',
    'company_settings',
    'fixed_commissions',
    'instructions',
    'insurance_products',
    'insurers',
    'invitations',
    'invoice_items',
    'invoices',
    'leads',
    'manual_commissions',
    'payout_items',
    'policies',
    'policy_addendums',
    'policy_types',
    'profiles',
    'report_schedules',
    'sales_assignments',
    'sales_processes',
    'saved_filters',
    'saved_reports',
    'unlinked_payments',
    'user_custom_privileges'
  ];

  return validTableNames.includes(tableName as DatabaseTableName);
}
