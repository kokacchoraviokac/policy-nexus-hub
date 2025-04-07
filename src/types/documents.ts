
// Extend the types for document-related operations

export enum EntityType {
  POLICY = 'policy',
  CLAIM = 'claim',
  SALES_PROCESS = 'sales_process',
  CLIENT = 'client',
  AGENT = 'agent',
  INSURER = 'insurer',
  SALE = 'sale',
  ADDENDUM = 'addendum',
  INVOICE = 'invoice'
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
  OTHER = 'other',
  MISCELLANEOUS = 'miscellaneous'
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
  uploaded_by_name?: string;
  created_at: string;
  updated_at: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  mime_type?: string;
  category?: DocumentCategory;
  company_id: string;
  approval_status?: DocumentApprovalStatus;
  approved_at?: string;
  approved_by?: string;
  description?: string;
  approval_notes?: string;
  comments?: { author: string; text: string; date: string }[];
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

export interface DocumentAnalysisPanelProps {
  document?: Document;
  file?: File;
  onAnalysisComplete?: () => void;
  onCategoryDetected?: (category: DocumentCategory) => void;
}

export type DocumentTableName = 
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents';

export interface DocumentUploadOptions {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  originalDocumentId?: string | null;
  currentVersion?: number;
}

export interface DocumentSearchParams {
  searchTerm?: string;
  category?: DocumentCategory;
  dateFrom?: string;
  dateTo?: string;
  entityType?: EntityType;
  uploadedBy?: string;
}

export interface UseDocumentSearchProps {
  initialParams?: DocumentSearchParams;
  entityId?: string;
  entityType?: EntityType;
}

export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  searchParams: DocumentSearchParams;
  setSearchParams: (params: DocumentSearchParams) => void;
  searchResults: Document[];
  totalResults: number;
  performSearch: () => void;
}

export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes?: string;
}
