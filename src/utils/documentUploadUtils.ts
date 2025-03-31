
import { EntityType } from "@/types/documents";

export type DocumentTableName = 
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "invoice_documents"
  | "agent_documents"
  | "insurer_documents";

export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case "policy":
      return "policy_documents";
    case "claim":
      return "claim_documents";
    case "sales_process":
      return "sales_documents";
    case "client":
      return "client_documents";
    case "invoice":
      return "invoice_documents";
    case "agent":
      return "agent_documents";
    case "insurer":
      return "insurer_documents";
    default:
      return "policy_documents";
  }
};
