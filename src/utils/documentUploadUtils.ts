
import { EntityType } from "@/types/documents";

/**
 * Returns the Supabase table name for the given entity type
 */
export function getDocumentTableName(entityType: EntityType): string {
  switch (entityType) {
    case "policy":
      return "policy_documents";
    case "claim":
      return "claim_documents";
    case "sales_process":
      return "sales_documents";
    case "client":
      return "client_documents";
    case "insurer":
      return "insurer_documents";
    case "agent":
      return "agent_documents";
    case "addendum":
      return "addendum_documents";
    case "invoice":
      return "invoice_documents";
    default:
      return "policy_documents"; // Default to policy_documents as fallback
  }
}

/**
 * Returns the column name for entity ID based on entity type
 */
export function getEntityIdColumn(entityType: EntityType): string {
  switch (entityType) {
    case "policy":
      return "policy_id";
    case "claim":
      return "claim_id";
    case "sales_process":
      return "sales_process_id";
    case "client":
      return "client_id";
    case "insurer":
      return "insurer_id";
    case "agent":
      return "agent_id";
    case "addendum":
      return "addendum_id";
    case "invoice":
      return "invoice_id";
    default:
      return "entity_id";
  }
}

/**
 * Safe type casting for table names to handle Supabase type constraints
 */
export function asTableName(tableName: string): any {
  return tableName as any;
}
