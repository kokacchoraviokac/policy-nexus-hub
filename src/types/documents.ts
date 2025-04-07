
// Extend the types for document-related operations

export enum EntityType {
  POLICY = 'policy',
  CLAIM = 'claim',
  SALES_PROCESS = 'sales_process',
  CLIENT = 'client',
  AGENT = 'agent',
  INSURER = 'insurer'
}

export enum DocumentCategory {
  POLICY = 'policy',
  CLAIM = 'claim',
  INVOICE = 'invoice',
  CONTRACT = 'contract',
  LIEN = 'lien',
  PROPOSAL = 'proposal',
  QUOTE = 'quote',
  NOTIFICATION = 'notification',
  OTHER = 'other'
}

export enum DocumentApprovalStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review',
  PENDING = 'pending'
}

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  mime_type?: string;
  category?: DocumentCategory;
  company_id: string;
  approval_status?: DocumentApprovalStatus;
  description?: string;
}

export type PolicyDocument = Document;

export interface DocumentUploadParams {
  file: File;
  documentName: string;
  documentType: string;
  category: DocumentCategory;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string;
  currentVersion?: number;
}

export interface DocumentUploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
}

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete?: () => void;
  defaultCategory?: DocumentCategory;
  salesStage?: string;
  selectedDocument?: Document;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
}
