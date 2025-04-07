
import { DocumentComment, EntityType, DocumentCategory, ApprovalStatus } from './common';

// Export these types directly from their original source
export { EntityType, DocumentCategory, ApprovalStatus };

// Document base interface
export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: string;
  entity_id: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  mime_type?: string;
  category?: DocumentCategoryString;
  is_latest_version?: boolean;
  version?: number;
  original_document_id?: string;
}

// Document table names
export type DocumentTableName = 
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

// Document upload options
export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category?: DocumentCategory;
  entityId: string;
  entityType: EntityType | string;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
}

// Document approval info
export interface ApprovalInfo {
  status: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  documentId?: string;
}

// Document upload dialog props
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

// Document analysis panel props
export interface DocumentAnalysisPanelProps {
  file: File;
  onAnalysisComplete: () => void;
  onCategoryDetected: (category: DocumentCategory) => void;
}
