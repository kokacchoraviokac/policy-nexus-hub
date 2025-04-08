
import { BaseEntity, EntityType, DocumentCategory, DocumentApprovalStatus, ApprovalStatus, Comment } from "./common";

// Document table name based on entity type
export type DocumentTableName =
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

// Base document interface
export interface Document extends BaseEntity {
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  category?: DocumentCategory;
  mime_type?: string;
  description?: string;
  approval_status?: DocumentApprovalStatus;
  approved_at?: string;
  approved_by?: string;
  approval_notes?: string;
  comments?: Comment[] | string[];
  status?: string;
  size?: number;
}

// Type for policy documents
export interface PolicyDocument extends Document {
  policy_id: string;
  addendum_id?: string;
}

// Type for claim documents
export interface ClaimDocument extends Document {
  claim_id: string;
}

// Type for sales documents
export interface SalesDocument extends Document {
  sales_process_id: string;
  step?: string;
}

// Document filter params
export interface DocumentFilterParams {
  entity_type?: EntityType;
  entity_id?: string;
  document_type?: string;
  category?: DocumentCategory;
  uploaded_by?: string;
  search_term?: string;
  date_from?: string;
  date_to?: string;
  approval_status?: DocumentApprovalStatus;
  is_latest_version?: boolean;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

// For backward compatibility - aliases to DocumentFilterParams
export type DocumentSearchParams = DocumentFilterParams;

// Document upload request interface
export interface DocumentUploadRequest {
  document_name: string;
  document_type: string;
  entity_type: EntityType;
  entity_id: string;
  file: File;
  category?: DocumentCategory;
  description?: string;
  original_document_id?: string;
  current_version?: number;
  meta?: Record<string, any>;
  step?: string;
}

// Document approval info
export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes: string;
  canApprove: boolean;
}

// Document approval request
export interface DocumentApprovalRequest {
  document_id: string;
  status: DocumentApprovalStatus;
  notes?: string;
  entity_type: EntityType;
}

// Document upload dialog props
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

// Document upload options
export interface DocumentUploadOptions {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
}

// Interface for the useDocumentSearch hook
export interface UseDocumentSearchProps {
  entityType?: EntityType;
  entityId?: string;
  initialFilters?: Partial<DocumentFilterParams>;
}

// Return type for useDocumentSearch
export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  filters: DocumentFilterParams;
  setFilters: (filters: Partial<DocumentFilterParams>) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  refetch: () => void;
}

// Return type for useDocuments hook
export interface UseDocumentsReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  deleteDocument: (documentId: string) => Promise<void>;
  isDeletingDocument: boolean;
  refetchDocuments: () => Promise<void>;
}
