
import { EntityType as CommonEntityType, DocumentCategory as CommonDocumentCategory } from "@/types/common";

// Re-export the types from common
export type EntityType = CommonEntityType;
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
  entity_type: EntityType; 
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
  comments?: string[]; // Added for DocumentViewDialog
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

// Document analysis panel props
export interface DocumentAnalysisPanelProps {
  document?: Document;
  file?: File;
  onAnalysisComplete?: () => void;
  onCategoryDetected?: (category: DocumentCategory) => void;
}

// Document PDF viewer props
export interface DocumentPdfViewerProps {
  url: string;
  className?: string;
}

// Document search parameters
export interface DocumentSearchParams {
  searchTerm?: string;
  category?: DocumentCategory;
  dateFrom?: string;
  dateTo?: string;
  entityType?: EntityType;
  entityId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  approvalStatus?: DocumentApprovalStatus;
}

// Document search props
export interface UseDocumentSearchProps {
  entityType?: EntityType;
  entityId?: string;
  category?: DocumentCategory;
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  initialSearchTerm?: string;
  approvalStatus?: DocumentApprovalStatus;
  initialSearchParams?: Partial<DocumentSearchParams>;
  companyId?: string;
}

// Document search return
export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  searchParams: DocumentSearchParams;
  setSearchParams: (params: Partial<DocumentSearchParams>) => void;
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  resetSearch: () => void;
  searchDocuments: (params?: Partial<DocumentSearchParams>) => Promise<void>;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  selectedCategory?: DocumentCategory;
  setSelectedCategory: (category?: DocumentCategory) => void;
  selectedApprovalStatus?: DocumentApprovalStatus;
  setSelectedApprovalStatus: (status?: DocumentApprovalStatus) => void;
  refetch: (options?: any) => Promise<any>;
}

// Document table name type
export type DocumentTableName = 
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'addendum_documents'
  | 'invoice_documents';
