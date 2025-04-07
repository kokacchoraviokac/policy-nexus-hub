
import { EntityType, DocumentCategory as CommonDocumentCategory, ApprovalStatus } from "./common";

// Re-export DocumentCategory for backward compatibility 
export { CommonDocumentCategory as DocumentCategory };

// Export DocumentApprovalStatus with the same values as ApprovalStatus
export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

// Re-export EntityType
export { EntityType };

export type DocumentTableName = 
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_id: string;
  entity_type: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  category?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  mime_type?: string;
  created_at: string;
  updated_at?: string;
  approval_status?: DocumentApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  tags?: string[];
  company_id?: string;
  metadata?: Record<string, any>;
  description?: string;
  comments?: string[];
  approval_notes?: string;
}

export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes: string;
}

export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category: string;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
  salesStage?: string;
}

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete?: () => void;
  defaultCategory?: CommonDocumentCategory | string;
  salesStage?: string;
  selectedDocument?: Document;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
}

export interface DocumentAnalysisPanelProps {
  file: File;
  onAnalysisComplete: () => void;
  onCategoryDetected: (category: CommonDocumentCategory) => void;
}

// Type for document lists and components
export interface PolicyDocument extends Document {
  policy_id: string;
}

export interface ClaimDocument extends Document {
  claim_id: string;
}

export interface SalesDocument extends Document {
  sales_process_id: string;
  step?: string;
}

// Add DocumentSearchParams interface
export interface DocumentSearchParams {
  entityType?: EntityType;
  entityId?: string;
  category?: string;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  approvalStatus?: DocumentApprovalStatus;
  page?: number;
  limit?: number;
}

export interface UseDocumentSearchProps {
  initialParams?: DocumentSearchParams;
  autoFetch?: boolean;
  entityType?: EntityType;
  entityId?: string;
  category?: string;
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  initialSearchTerm?: string;
  approvalStatus?: DocumentApprovalStatus;
}

export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  searchParams: DocumentSearchParams;
  setSearchParams: (params: Partial<DocumentSearchParams>) => void;
  refresh: () => void;
  isError: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory?: string;
  setSelectedCategory: (category?: string) => void;
  searchDocuments: (params?: Partial<DocumentSearchParams>) => Promise<void>;
  totalPages: number;
  itemsCount: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
}
