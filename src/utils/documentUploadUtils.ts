
import { EntityType } from "@/types/documents";

// Define a type for document table names
export type DocumentTableName = 
  | "policy_documents" 
  | "claim_documents" 
  | "sales_documents" 
  | "client_documents" 
  | "insurer_documents" 
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

/**
 * Gets the appropriate database table name for the specified entity type
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
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
    case "invoice":
      return "invoice_documents";
    case "addendum":
      return "addendum_documents";
    default:
      // If for some reason we get an unknown entity type,
      // default to policy_documents to prevent runtime errors
      console.warn(`Unknown entity type: ${entityType}, defaulting to policy_documents`);
      return "policy_documents";
  }
}
