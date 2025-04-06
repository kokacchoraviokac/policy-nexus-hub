
import { supabase } from '@/integrations/supabase/client';
import { RelationName } from '@/types/common';
import { DocumentTableName } from '@/types/documents';

/**
 * Type-safe function to get a Supabase query builder for any table
 * This ensures the table name is one of the allowed RelationName types
 */
export function fromTable(tableName: RelationName) {
  return supabase.from(tableName);
}

/**
 * Helper to safely cast a DocumentTableName to RelationName
 * This ensures we only use valid table names for document operations
 */
export function documentTableToRelation(tableName: DocumentTableName): RelationName {
  // Validate that the provided table name is a valid RelationName
  const validTableNames: RelationName[] = [
    'policy_documents',
    'claim_documents',
    'sales_documents',
    'client_documents',
    'insurer_documents',
    'agent_documents',
    'addendum_documents',
    'invoice_documents'
  ];

  if (validTableNames.includes(tableName as RelationName)) {
    return tableName as RelationName;
  }

  // Default to policy_documents if not valid
  console.warn(`Invalid table name: ${tableName}, using policy_documents as fallback`);
  return 'policy_documents';
}

/**
 * Helper for safely executing queries with proper type checking
 */
export async function executeQuery<T = any>(
  tableName: RelationName,
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
