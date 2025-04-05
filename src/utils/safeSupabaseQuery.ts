
import { supabase } from "@/integrations/supabase/client";

/**
 * A safer wrapper for Supabase queries that works with dynamic table names
 * by using type assertions to avoid TypeScript errors
 */
export function safeSupabaseQuery(tableName: string) {
  // Use type assertion to avoid TypeScript limitations with dynamic table names
  return supabase.from(tableName as any);
}

/**
 * Safely create a query for document tables
 */
export function safeDocumentQuery(tableName: string) {
  return supabase.from(tableName as any);
}

/**
 * Helper for document tables with runtime checking
 */
export function queryWithEntityType(entityType: string) {
  let tableName = '';
  
  switch (entityType) {
    case 'policy':
      tableName = 'policy_documents';
      break;
    case 'claim':
      tableName = 'claim_documents';
      break;
    case 'sales_process':
      tableName = 'sales_documents';
      break;
    case 'client':
      tableName = 'client_documents';
      break;
    case 'insurer':
      tableName = 'insurer_documents';
      break;
    case 'agent':
      tableName = 'agent_documents';
      break;
    case 'invoice':
      tableName = 'invoice_documents';
      break;
    case 'addendum':
      tableName = 'addendum_documents';
      break;
    default:
      console.warn(`Unknown entity type: ${entityType}, defaulting to policy_documents`);
      tableName = 'policy_documents';
  }
  
  return supabase.from(tableName as any);
}

/**
 * Helper to safely cast query results to a specific type
 */
export function safeQueryCast<T>(data: any): T {
  return data as T;
}
