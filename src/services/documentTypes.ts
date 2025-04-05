
import { EntityType } from "@/types/documents";

export interface DocumentTypeMapping {
  label: string;
  description?: string;
  icon?: string;
}

export const documentTypeMap: Record<string, DocumentTypeMapping> = {
  policy: {
    label: "Policy Document",
    description: "Official policy documents issued by insurers",
    icon: "FileText"
  },
  invoice: {
    label: "Invoice",
    description: "Billing documents and receipts",
    icon: "Receipt"
  },
  contract: {
    label: "Contract",
    description: "Legal agreements and contracts",
    icon: "FileContract"
  },
  claim: {
    label: "Claim",
    description: "Claim-related documentation",
    icon: "FileCheck"
  },
  quote: {
    label: "Quote",
    description: "Insurance quotations and offers",
    icon: "FileText"
  },
  certificate: {
    label: "Certificate",
    description: "Insurance certificates",
    icon: "Award"
  },
  correspondence: {
    label: "Correspondence",
    description: "Letters and communication with clients or insurers",
    icon: "Mail"
  },
  report: {
    label: "Report",
    description: "Analysis reports and assessments",
    icon: "FileAnalytics"
  },
  other: {
    label: "Other",
    description: "Miscellaneous documents",
    icon: "File"
  }
};

export const entityTablesMap: Record<EntityType, string> = {
  policy: "policy_documents",
  claim: "claim_documents",
  sales_process: "sales_documents",
  client: "client_documents",
  insurer: "insurer_documents",
  agent: "agent_documents",
  invoice: "invoice_documents",
  addendum: "addendum_documents"
};
