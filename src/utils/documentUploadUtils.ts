
import { EntityType } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * Get the appropriate document table name based on entity type
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
  switch (entityType) {
    case EntityType.POLICY:
      return "policy_documents";
    case EntityType.CLAIM:
      return "claim_documents";
    case EntityType.SALES_PROCESS:
      return "sales_documents";
    case EntityType.CLIENT:
      return "client_documents";
    case EntityType.INSURER:
      return "insurer_documents";
    case EntityType.AGENT:
      return "agent_documents";
    case EntityType.INVOICE:
      return "invoice_documents";
    case EntityType.POLICY_ADDENDUM:
    case EntityType.ADDENDUM:
      return "addendum_documents";
    default:
      // Default to policy_documents as a fallback
      console.warn(`No document table mapping for entity type: ${entityType}, using policy_documents as fallback`);
      return "policy_documents";
  }
}

/**
 * Get the appropriate entity ID field name based on the document table name
 */
export function getEntityIdField(tableName: DocumentTableName): string {
  switch (tableName) {
    case "policy_documents":
      return "policy_id";
    case "claim_documents":
      return "claim_id";
    case "sales_documents":
      return "sales_process_id";
    case "client_documents":
      return "client_id";
    case "insurer_documents":
      return "insurer_id";
    case "agent_documents":
      return "agent_id";
    case "invoice_documents":
      return "invoice_id";
    case "addendum_documents":
      return "addendum_id";
    default:
      return "entity_id";
  }
}
