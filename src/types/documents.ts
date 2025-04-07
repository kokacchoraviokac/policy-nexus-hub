
import { DocumentComment, EntityType, DocumentCategory, ApprovalStatus } from './common';

// Export these types directly from their original source
export { EntityType, DocumentCategory, ApprovalStatus };

// Document approval status
export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

// Document base interface
export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: string;
  entity_id: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  mime_type?: string;
  category?: DocumentCategory;
  is_latest_version?: boolean;
  version?: number;
  original_document_id?: string;
  description?: string;
  approval_status?: DocumentApprovalStatus;
  status?: string;
  comments?: DocumentComment[];
  uploaded_by_name?: string;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  // Fields needed for document operations
  policy_id?: string;
  claim_id?: string;
  sales_process_id?: string;
  invoice_id?: string;
  addendum_id?: string;
  client_id?: string;
  insurer_id?: string;
  agent_id?: string;
}

// Type alias for backward compatibility
export type DocumentCategoryString = DocumentCategory;

// Type for Policy Document
export interface PolicyDocument extends Document {
  policy_id: string;
}

// Document table names
export type DocumentTableName = 
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

// Document search parameters
export interface DocumentSearchParams {
  entityType?: EntityType;
  entityId?: string;
  category?: DocumentCategory;
  startDate?: string;
  endDate?: string;
  status?: DocumentApprovalStatus;
  searchTerm?: string;
}

// Props for document search hook
export interface UseDocumentSearchProps {
  defaultParams?: DocumentSearchParams;
  entityType?: EntityType;
  entityId?: string;
  category?: DocumentCategory;
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  initialSearchTerm?: string;
  approvalStatus?: DocumentApprovalStatus;
  initialSearchParams?: DocumentSearchParams;
  autoFetch?: boolean;
}

// Return type for document search hook
export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  searchParams: DocumentSearchParams;
  setSearchParams: (params: DocumentSearchParams) => void;
  refresh: () => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  selectedCategory?: DocumentCategory;
  setSelectedCategory?: (category: DocumentCategory) => void;
  searchDocuments?: () => void;
  currentPage?: number;
  totalPages?: number;
  itemsCount?: number;
  itemsPerPage?: number;
  handlePageChange?: (page: number) => void;
  isError?: boolean;
  totalCount?: number;
}

// Document upload options
export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category?: DocumentCategory;
  entityId: string;
  entityType: EntityType | string;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
  description?: string;
}

// Document approval info
export interface ApprovalInfo {
  status: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  documentId?: string;
}

// Document upload dialog props
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
  file: File;
  onAnalysisComplete: () => void;
  onCategoryDetected: (category: DocumentCategory) => void;
}

// Comment type for documents
export interface Comment {
  id?: string;
  document_id: string;
  user_id: string;
  author: string;
  text: string;
  created_at?: string;
}
