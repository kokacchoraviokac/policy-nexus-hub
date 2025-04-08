
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

// Comment interface for document comments
export interface Comment extends BaseEntity {
  document_id: string;
  user_id: string;
  content: string;
  author?: string; // Backward compatibility
  text?: string;   // Backward compatibility
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
  salesStage?: string;
  onSuccess?: (document: Document) => void;
  onError?: (error: Error) => void;
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
  onSuccess?: (document: Document) => void;
}

// Policy document (special case of Document)
export interface PolicyDocument extends Document {
  policy_id: string;
}

// Document search parameters
export interface DocumentSearchParams extends DocumentFilterParams {
  searchTerm?: string;
}

// Document search props
export interface UseDocumentSearchProps {
  initialFilters?: Partial<DocumentFilterParams>;
  pageSize?: number;
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
}

// Re-export important types from common.ts
export { EntityType, DocumentCategory, DocumentApprovalStatus } from "./common";
