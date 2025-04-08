
import { BaseEntity } from "./common";
import { EntityType, DocumentCategory, DocumentApprovalStatus, Comment } from "./common";

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
  status?: string; // For document status tracking
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

// Document upload options
export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category?: string;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
  description?: string;
}

// Document upload parameters
export interface UseDocumentUploadParams {
  entityType: EntityType;
  entityId: string;
  originalDocumentId?: string;
  currentVersion?: number;
  onSuccess?: (document: Document) => void;
  onError?: (error: Error) => void;
  salesStage?: string;
}

// Document approval info
export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes: string;
  canApprove: boolean;
}

// Document upload dialog props
export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  selectedDocument?: Document;
  onUploadComplete?: (document?: Document) => void;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
  defaultCategory?: DocumentCategory;
  salesStage?: string;
}

// Policy document (special case of Document)
export interface PolicyDocument extends Document {
  policy_id: string;
}

// Document upload request
export interface DocumentUploadRequest {
  file: File;
  document_name: string;
  document_type: string;
  entity_type: EntityType;
  entity_id: string;
  category?: DocumentCategory;
  version?: number;
  original_document_id?: string;
  description?: string;
  company_id?: string;
}

// Document search parameters
export interface DocumentSearchParams extends DocumentFilterParams {
  searchTerm?: string;
  entityType?: EntityType;
  entityId?: string;
  dateFrom?: string;
  dateTo?: string;
  documentType?: string;
}

// Document search props
export interface UseDocumentSearchProps {
  pageSize?: number;
  initialFilters?: Partial<DocumentFilterParams>;
  defaultParams?: Partial<DocumentSearchParams>;
  autoSearch?: boolean;
  entityType?: EntityType;
  entityId?: string;
  category?: DocumentCategory;
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  initialSearchTerm?: string;
  approvalStatus?: DocumentApprovalStatus;
  initialSearchParams?: Partial<DocumentSearchParams>;
  autoFetch?: boolean;
}

// Document search return type
export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
  filters: DocumentFilterParams;
  setFilters: (filters: Partial<DocumentFilterParams>) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  refetch: () => void;
  searchParams?: DocumentSearchParams;
  setSearchParams?: (params: Partial<DocumentSearchParams>) => void;
  search?: () => void;
  totalCount?: number;
  totalPages?: number;
  resetSearch?: () => void;
}

// Document hooks return type
export interface UseDocumentsReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  deleteDocument: (id: string) => Promise<void>;
  isDeletingDocument: boolean;
  refetchDocuments?: () => void;
}

// Re-export types from common.ts to avoid importing from multiple places
export {
  EntityType, 
  DocumentCategory, 
  DocumentApprovalStatus,
  ApprovalStatus,
  Comment
};
