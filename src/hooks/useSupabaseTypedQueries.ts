
import { supabase } from "@/integrations/supabase/client";
import { DocumentTableName } from "@/types/documents";

/**
 * A utility to help with type-safe Supabase queries for document tables
 * This safely casts the dynamic table name to one of the accepted table names
 * in the Supabase database schema
 */
export function useSupabaseTypedQueries() {
  /**
   * Get a reference to a document table with type safety
   */
  const getDocumentTable = (tableName: DocumentTableName) => {
    // Map the document table name to the actual table name in Supabase
    // This helps TypeScript understand that we're using a valid table
    const validTableNames: Record<DocumentTableName, string> = {
      'policy_documents': 'policy_documents',
      'claim_documents': 'claim_documents',
      'sales_documents': 'sales_documents',
      'client_documents': 'client_documents',
      'insurer_documents': 'insurer_documents',
      'agent_documents': 'agent_documents',
      'invoice_documents': 'invoice_documents',
      'addendum_documents': 'addendum_documents'
    };
    
    // Use the valid table name to create a properly typed query
    // Using type assertion to let TypeScript know this is a valid table name
    return supabase.from(validTableNames[tableName] as any);
  };
  
  return {
    getDocumentTable
  };
}
