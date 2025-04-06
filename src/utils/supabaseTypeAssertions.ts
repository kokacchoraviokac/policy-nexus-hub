
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility functions for making type-safe Supabase queries
 * These functions provide type assertions that help avoid TypeScript errors
 * when working with dynamic table names
 */

/**
 * Makes a query to a document table using type assertions
 * to avoid TypeScript errors
 */
export function fromDocumentTable(tableName: string) {
  return supabase.from(tableName as any);
}

/**
 * Makes a query to any table using type assertions
 * to avoid TypeScript errors
 */
export function fromTable(tableName: string) {
  return supabase.from(tableName as any);
}

/**
 * Makes a query to a specific document table based on entity type
 */
export function fromEntityTable(entityType: string) {
  let tableName: string;
  
  switch (entityType) {
    case 'policy':
      tableName = 'policy_documents';
      break;
    case 'claim':
      tableName = 'claim_documents';
      break;
    case 'sales_process':
    case 'sale':
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
 * Safely casts any data type for Supabase queries
 */
export function safeTableCast<T>(table: T): any {
  return table;
}

/**
 * Helper to safely convert an error to a string
 */
export function errorToString(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
