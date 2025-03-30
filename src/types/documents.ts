
import type { EntityType } from "@/utils/activityLogger";

// Define specific table names to avoid type inference issues
export type DocumentTableName = "policy_documents" | "claim_documents" | "sales_documents";

// Document categories for organization
export type DocumentCategory = "claim_evidence" | "medical" | "legal" | "financial" | "correspondence" | "other";

// Document approval status
export type DocumentApprovalStatus = "pending" | "approved" | "rejected" | "needs_review";

// Define a base document interface with common fields
export interface DocumentBase {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  uploaded_by: string;
  category?: DocumentCategory;
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  version: number;
  is_latest_version: boolean;
  original_document_id?: string;
  [key: string]: any; // Index signature for Json compatibility
}

// Define specific document types for different tables
export interface PolicyDocument extends DocumentBase {
  policy_id?: string;
  addendum_id?: string;
  company_id: string;
  updated_at: string;
  mime_type?: string;
}

export interface ClaimDocument extends DocumentBase {
  claim_id: string;
  company_id: string;
  updated_at: string;
}

export interface SalesDocument extends DocumentBase {
  sales_process_id: string;
  company_id: string;
  updated_at: string;
  step?: string;
}

// Union type for all document types from DB
export type DocumentDbRow = PolicyDocument | ClaimDocument | SalesDocument;

// Frontend document model
export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  entity_type?: EntityType;
  entity_id?: string;
  uploaded_by_id?: string;
  uploaded_by_name?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  mime_type?: string;
  file_size?: number;
  tags?: string[];
  category?: DocumentCategory;
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  [key: string]: any; // Index signature for Json compatibility
}

export interface UseDocumentsProps {
  entityType: EntityType;
  entityId: string;
  enabled?: boolean;
}
