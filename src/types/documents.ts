
import { BaseEntity } from "./common";
import { EntityType, DocumentCategory, DocumentApprovalStatus } from "./common";

// Document table names for storage operations
export type DocumentTableName = 
  | "policy_documents"
  | "claim_documents" 
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

// Core Document Interface
export interface Document extends BaseEntity {
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  mime_type?: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  category?: string;
  description?: string;
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  comments?: Comment[];
}

// Document filter parameters
export interface DocumentFilterParams {
  page: number;
  page_size: number;
  search_term?: string;
  entity_type?: EntityType;
  entity_id?: string;
  document_type?: string;
  category?: DocumentCategory;
  date_from?: string;
  date_to?: string;
  status?: DocumentApprovalStatus;
  uploaded_by?: string;
}

// Re-export important types from common.ts
export { EntityType, DocumentCategory, DocumentApprovalStatus } from "./common";
