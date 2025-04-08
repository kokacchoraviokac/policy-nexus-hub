
import { EntityType, DocumentCategory, DocumentApprovalStatus } from './common';

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_id?: string;
  entity_type: EntityType;
  uploaded_by: string;
  uploaded_by_name?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  category?: string;
  approval_status?: DocumentApprovalStatus;
  approved_at?: string;
  approved_by?: string;
  notes?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  mime_type?: string;
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

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  selectedDocument?: Document;
  onUploadComplete?: () => void;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
  defaultCategory?: DocumentCategory;
  salesStage?: string;
}

export interface Comment {
  id: string;
  document_id: string;
  author: string;
  text: string;
  created_at: string;
  user_id: string;
}

export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category: DocumentCategory | string;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
}

export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes: string;
  canApprove: boolean;
}

export type DocumentTableName = "policy_documents" | "claim_documents" | "sales_documents" | "client_documents" | "insurer_documents" | "agent_documents";

// Re-export enums from common to maintain compatibility
export { EntityType, DocumentCategory, DocumentApprovalStatus };
