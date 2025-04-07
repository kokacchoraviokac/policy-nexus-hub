
export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process",
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  INVOICE = "invoice",
  ADDENDUM = "addendum"
}

export enum DocumentCategory {
  POLICY = "policy",
  CLAIM = "claim",
  INVOICE = "invoice",
  CONTRACT = "contract",
  NOTIFICATION = "notification",
  LIEN = "lien",
  OTHER = "other",
  PROPOSAL = "proposal",
  QUOTE = "quote",
  SALES = "sales",
  FINANCIAL = "financial",
  LEGAL = "legal",
  MEDICAL = "medical",
  CORRESPONDENCE = "correspondence",
  MISCELLANEOUS = "miscellaneous"
}

export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export type DocumentTableName = 
  | "policy_documents"
  | "claim_documents" 
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  description?: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  category?: DocumentCategory;
  status?: DocumentApprovalStatus;
  version?: number;
  original_document_id?: string;
  is_latest_version?: boolean;
  created_at: string;
  updated_at: string;
  mime_type?: string;
  file_size?: number;
  comments?: DocumentComment[] | string[];
}

export interface PolicyDocument extends Document {
  policy_id: string;
  addendum_id?: string;
}

export interface ClaimDocument extends Document {
  claim_id: string;
}

export interface SalesDocument extends Document {
  sales_process_id: string;
  step?: string;
}

export interface ClientDocument extends Document {
  client_id: string;
}

export interface InsurerDocument extends Document {
  insurer_id: string;
}

export interface AgentDocument extends Document {
  agent_id: string;
}

export interface InvoiceDocument extends Document {
  invoice_id: string;
}

export interface AddendumDocument extends Document {
  addendum_id: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  author: string;
  text: string;
  user_id: string;
  created_at: string;
}

export interface DocumentAnalysisPanelProps {
  file: File;
  onCategoryDetected: (category: DocumentCategory) => void;
  onAnalysisComplete: () => void;
}

export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes: string;
  canApprove: boolean;
}
