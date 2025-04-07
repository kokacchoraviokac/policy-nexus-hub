
import { EntityType, ApprovalStatus, DocumentCategory } from "@/types/common";

export enum DocumentApprovalStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
  NEEDS_REVIEW = "needs_review"
}

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: string;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  mime_type?: string;
  description?: string;
  category?: string;
  version?: number;
  original_document_id?: string;
  is_latest_version?: boolean;
  status?: string;
  approval_status?: string;
  approved_at?: string;
  approval_notes?: string;
  comments?: any[];
}

export interface PolicyDocument extends Document {
  policy_id: string;
  addendum_id?: string;
}

export interface ClaimDocument extends Document {
  claim_id: string;
}

export interface SalesDocument extends Document {
  sales_process_id: string;
  step?: string;
}

export interface ClientDocument extends Document {
  client_id: string;
}

export interface InsurerDocument extends Document {
  insurer_id: string;
}

export type DocumentTableName =
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents";

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

export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category?: string;
  entityId: string;
  entityType: string;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
  description?: string;
}

export interface DocumentSearchParams {
  entityType?: string;
  entityId?: string;
  category?: string;
  documentType?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  userId?: string;
  approvalStatus?: string;
}

export interface UseDocumentSearchProps {
  initialParams?: Partial<DocumentSearchParams>;
  autoSearch?: boolean;
  entityType?: string;
  entityId?: string;
  category?: string;
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  initialSearchTerm?: string;
  approvalStatus?: string;
  initialSearchParams?: Partial<DocumentSearchParams>;
  autoFetch?: boolean;
}

export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  search: (params?: Partial<DocumentSearchParams>) => Promise<void>;
  searchParams: DocumentSearchParams;
  updateSearchParams: (params: Partial<DocumentSearchParams>) => void;
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  searchTerm?: string;
  setSearchTerm?: (term: string) => void; 
  selectedCategory?: string;
  setSelectedCategory?: (category: DocumentCategory | undefined) => void;
  searchDocuments?: () => void;
  currentPage?: number;
  totalPages?: number;
  itemsCount?: number;
  itemsPerPage?: number;
  handlePageChange?: (page: number) => void;
  totalCount?: number;
}

export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes: string;
  canApprove: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  created_at: string;
  document_id: string;
  user_id: string;
}
