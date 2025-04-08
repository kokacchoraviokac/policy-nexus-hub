
import { DocumentCategory, ApprovalStatus, Comment } from '@/types/common';

// Entity type enumeration
export enum EntityType {
  POLICY = "policy",
  CLAIM = "claim",
  SALES_PROCESS = "sales_process",
  CLIENT = "client",
  INSURER = "insurer",
  AGENT = "agent",
  INVOICE = "invoice",
  POLICY_ADDENDUM = "policy_addendum",
  ADDENDUM = "addendum",
  SALE = "sale" // Alias for sales_process
}

// Document approval status enumeration (re-exported from common for backward compatibility)
export { ApprovalStatus };
export type DocumentApprovalStatus = ApprovalStatus;

// Document table name type
export type DocumentTableName = 
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

// Document interface
export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType | string;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  category?: DocumentCategory | string;
  status?: ApprovalStatus | string; // For approval status
  approval_status?: ApprovalStatus | string; // For backward compatibility
  approved_at?: string;
  approved_by?: string;
  approval_notes?: string;
  mime_type?: string | null;
  description?: string;
  comments?: Comment[];
}

// For backward compatibility
export type PolicyDocument = Document;

// Document upload options
export interface DocumentUploadOptions {
  entityId: string;
  entityType: EntityType;
  document: File;
  documentName: string;
  documentType: string;
  category?: DocumentCategory;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Document upload request
export interface DocumentUploadRequest {
  file: File;
  documentName: string;
  documentType: string;
  category?: DocumentCategory;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
}

// Document upload dialog props
export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  selectedDocument?: Document;
  onUploadComplete?: () => void;
  defaultCategory?: DocumentCategory | string;
  salesStage?: string;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
}

// Document search parameters
export interface DocumentSearchParams {
  page: number;
  page_size: number;
  searchTerm?: string;
  entity_type?: EntityType | string;
  entity_id?: string;
  category?: DocumentCategory | string;
  document_type?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  approval_status?: ApprovalStatus | string;
}

// Document filter parameters (alias for DocumentSearchParams)
export type DocumentFilterParams = DocumentSearchParams;

// Document search hook props
export interface UseDocumentSearchProps {
  defaultParams?: Partial<DocumentSearchParams>;
  autoSearch?: boolean;
  entityType?: EntityType | string;
  entityId?: string;
  category?: DocumentCategory | string;
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  initialSearchTerm?: string;
  approvalStatus?: ApprovalStatus | string;
  initialSearchParams?: Partial<DocumentSearchParams>;
  autoFetch?: boolean;
}

// Document search hook return type
export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchParams: DocumentSearchParams;
  setSearchParams: (params: Partial<DocumentSearchParams>) => void;
  search: () => void;
  resetSearch: () => void;
  totalCount: number;
  totalPages: number;
}

// Document upload hook parameters
export interface UseDocumentUploadParams {
  entityId: string;
  entityType: EntityType;
  onSuccess?: () => void;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
}

// Approval information interface
export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes: string;
  canApprove: boolean;
}

// Use document return type
export interface UseDocumentsReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  deleteDocument: (documentId: string) => Promise<void>;
  isDeletingDocument: boolean;
  refetchDocuments: () => Promise<void>;
}

export type { Comment };  // Re-export Comment for backward compatibility

