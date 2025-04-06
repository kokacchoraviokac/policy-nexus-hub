
import { EntityType, DocumentCategory as CommonDocumentCategory } from "@/types/common";

// Re-export the DocumentCategory from common types
export type DocumentCategory = CommonDocumentCategory;

// Document status types
export type DocumentStatus = "active" | "archived" | "deleted";

// Document approval status
export type DocumentApprovalStatus = "pending" | "approved" | "rejected" | "needs_review";

// Base Document interface
export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType; // Reference from common types
  entity_id: string;
  created_at: string;
  updated_at?: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  company_id: string;
  mime_type?: string;
  description?: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
  approval_status?: DocumentApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
}

// Document list display options
export interface DocumentListOptions {
  showUploadButton?: boolean;
  showApprovalStatus?: boolean;
  showFilters?: boolean;
  filterCategory?: DocumentCategory;
  emptyMessage?: string;
}

// File upload options
export interface FileOptions {
  fileName?: string;
  contentType?: string;
  cacheControl?: string;
}

// Document upload options
export interface DocumentUploadOptions {
  entityType: EntityType;
  entityId: string;
  documentName: string;
  documentType: string;
  file: File;
  category?: DocumentCategory;
  description?: string;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
}

// Interface for document upload dialog props
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
