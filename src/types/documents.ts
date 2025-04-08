
import type { BaseEntity, Comment, DocumentCategory as CommonDocumentCategory, EntityType as CommonEntityType, ApprovalStatus } from '@/types/common';

// Re-export EntityType from common.ts
export type EntityType = CommonEntityType;
export { CommonEntityType as EntityType };

// Re-export DocumentCategory from common.ts
export type DocumentCategory = CommonDocumentCategory;
export { CommonDocumentCategory as DocumentCategory };

// Export ApprovalStatus and DocumentApprovalStatus as type (for backward compatibility)
export type DocumentApprovalStatus = ApprovalStatus;
export { ApprovalStatus };

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
export interface Document extends BaseEntity {
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType | string;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  company_id: string;
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
  description?: string;
  file?: File; // For backward compatibility
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
  description?: string;
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
  onError?: (error: Error) => void;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
}

// Approval information interface
export interface ApprovalInfo {
  document_id: string;
  status: ApprovalStatus;
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
