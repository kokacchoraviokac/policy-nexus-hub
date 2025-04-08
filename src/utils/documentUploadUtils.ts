
import { EntityType } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * Get the document table name based on entity type
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
  switch (entityType) {
    case EntityType.POLICY:
    case EntityType.POLICY_ADDENDUM:
      return "policy_documents";
    case EntityType.CLAIM:
      return "claim_documents";
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return "sales_documents";
    case EntityType.CLIENT:
      return "client_documents";
    case EntityType.INSURER:
      return "insurer_documents";
    case EntityType.AGENT:
      return "agent_documents";
    case EntityType.INVOICE:
      return "invoice_documents";
    case EntityType.ADDENDUM:
      return "policy_documents"; // Addendums use the policy documents table
    default:
      return "policy_documents"; // Default fallback
  }
}

/**
 * Get the entity ID column name based on entity type
 */
export function getEntityIdColumn(entityType: EntityType): string {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_id';
    case EntityType.CLAIM:
      return 'claim_id';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'sales_process_id';
    case EntityType.CLIENT:
      return 'client_id';
    case EntityType.INSURER:
      return 'insurer_id';
    case EntityType.AGENT:
      return 'agent_id';
    case EntityType.INVOICE:
      return 'invoice_id';
    case EntityType.ADDENDUM:
    case EntityType.POLICY_ADDENDUM:
      return 'addendum_id';
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
}

/**
 * Helper function to safely cast a string as a table name for Supabase operations
 * This helps prevent TypeScript errors when using dynamic table names
 */
export function asTableName(tableName: string | DocumentTableName): DocumentTableName {
  // This is a type assertion function to help TypeScript understand
  // that the string is a valid table name
  return tableName as DocumentTableName;
}

/**
 * Safely convert any string to a table name
 */
export function toTableName(tableName: string): DocumentTableName {
  const validTableNames: DocumentTableName[] = [
    "policy_documents",
    "claim_documents",
    "sales_documents",
    "client_documents",
    "insurer_documents",
    "agent_documents",
    "invoice_documents",
    "addendum_documents"
  ];
  
  if (validTableNames.includes(tableName as DocumentTableName)) {
    return tableName as DocumentTableName;
  }
  
  // Default fallback
  return "policy_documents";
}
