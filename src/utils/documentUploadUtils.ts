
import { EntityType } from "@/types/documents";

// Define explicit table names for document tables
export const DOCUMENT_TABLES = [
  'policy_documents', 
  'claim_documents', 
  'sales_documents',
  'client_documents',
  'insurer_documents',
  'agent_documents',
  'invoice_documents',
  'addendum_documents'
] as const;

// Export the document table type
export type DocumentTableName = typeof DOCUMENT_TABLES[number];

/**
 * Gets the appropriate document table name for a given entity type
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
  switch (entityType) {
    case 'policy':
      return 'policy_documents';
    case 'claim':
      return 'claim_documents';
    case 'sales_process':
      return 'sales_documents';
    case 'client':
      return 'client_documents';
    case 'insurer':
      return 'insurer_documents';
    case 'agent':
      return 'agent_documents';
    case 'invoice':
      return 'invoice_documents';
    case 'addendum':
      return 'addendum_documents';
    default:
      // Type guard ensures this doesn't happen, but TypeScript wants a fallback
      return 'policy_documents';
  }
}

/**
 * Generates a document storage path
 */
export function generateDocumentPath(entityType: EntityType, entityId: string, fileName: string): string {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  return `${entityType}/${entityId}/${timestamp}_${safeFileName}`;
}
