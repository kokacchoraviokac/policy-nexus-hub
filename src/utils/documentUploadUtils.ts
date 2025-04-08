
import { DocumentTableName, EntityType } from "@/types/documents";
import { RelationName } from "@/types/common";

// Helper function to convert EntityType to DocumentTableName
export const asTableName = (entityType: EntityType): DocumentTableName => {
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
      return "policy_documents"; // Default fallback
  }
};

// Helper function for safe table access
export const safeTableName = (tableName: DocumentTableName | string): RelationName => {
  // Cast the tableName to RelationName to make TypeScript happy
  return tableName as RelationName;
};
