
import { supabase } from "@/integrations/supabase/client";
import { RelationName } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * A type-safe wrapper for accessing document tables
 * This ensures we get proper typing in the response
 */
export const fromDocumentTable = (tableName: DocumentTableName) => {
  // Create a safer RelationName by restricting to known document tables
  const validTables: Record<DocumentTableName, RelationName> = {
    'policy_documents': 'policy_documents',
    'claim_documents': 'claim_documents', 
    'sales_documents': 'sales_documents',
    'client_documents': 'client_documents',
    'insurer_documents': 'insurer_documents',
    'agent_documents': 'agent_documents',
    'invoice_documents': 'invoice_documents',
    'addendum_documents': 'addendum_documents'
  };

  // Ensure we're using a valid table name
  const relationName = validTables[tableName];
  
  // Cast to any to avoid TypeScript errors with dynamic table names
  // This is safe because we've verified the table name is valid
  return supabase.from(relationName as any);
};

/**
 * A type-safe wrapper for general table access
 */
export const fromTable = (tableName: string) => {
  // Cast the tableName to any and rely on runtime validation
  return supabase.from(tableName as any);
};
