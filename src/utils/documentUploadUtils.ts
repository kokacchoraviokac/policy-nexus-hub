
import { EntityType } from "@/types/documents";

// Define document tables as a union of valid table names that actually exist in the database
export type DocumentTableName = 
  | "policy_documents"
  | "claim_documents"
  | "sales_documents";

export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case "policy":
      return "policy_documents";
    case "claim":
      return "claim_documents";
    case "sales_process":
      return "sales_documents";
    case "client":
    case "invoice":
    case "agent":
    case "insurer":
    case "addendum":
    default:
      // For now, default to policy_documents for any unsupported types
      // This prevents TypeScript errors but we should handle these properly
      return "policy_documents";
  }
};
