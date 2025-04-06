
import { EntityType } from './common';

export enum DocumentCategory {
  POLICY = 'policy',
  CLAIM = 'claim',
  INVOICE = 'invoice',
  LIEN = 'lien',
  NOTIFICATION = 'notification',
  CONTRACT = 'contract',
  MISCELLANEOUS = 'miscellaneous',
  PROPOSAL = 'proposal'
}

// Re-export EntityType for backward compatibility
export { EntityType } from './common';

export enum DocumentApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review'
}

export interface PolicyDocument {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  category?: string;
  created_at: string;
  updated_at: string;
  uploaded_by: string;
  company_id: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  mime_type?: string;
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_at?: string;
  approved_by?: string;
  description?: string;
  uploaded_by_name?: string;
  comments?: Array<{
    id: string;
    text: string;
    created_at: string;
    author: string;
  }>;
}

export type Document = PolicyDocument; // Alias for backward compatibility

export type DocumentTableName = 
  | 'policy_documents' 
  | 'claim_documents' 
  | 'sales_documents' 
  | 'client_documents' 
  | 'insurer_documents' 
  | 'agent_documents' 
  | 'addendum_documents' 
  | 'invoice_documents';

export interface DocumentUploadParams {
  entityId: string;
  entityType: EntityType;
  file: File;
  documentName?: string;
  documentType?: string;
  category?: string;
  description?: string;
}

export interface DocumentUploadResult {
  success: boolean;
  document?: PolicyDocument;
  error?: string;
}

export interface DocumentUploadOptions {
  entityId: string;
  entityType: EntityType;
  defaultCategory?: DocumentCategory;
  selectedDocument?: PolicyDocument;
  onSuccess?: () => void;
  originalDocumentId?: string;
  currentVersion?: number;
}

export interface DocumentSearchParams {
  entityType?: EntityType;
  entityId?: string;
  category?: DocumentCategory;
  documentType?: string;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  approvalStatus?: DocumentApprovalStatus;
}

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
  autoFetch?: boolean;
}

export interface UseDocumentSearchReturn {
  documents: PolicyDocument[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: DocumentCategory | undefined;
  setSelectedCategory: (category: DocumentCategory | undefined) => void;
  selectedApprovalStatus: DocumentApprovalStatus | undefined;
  setSelectedApprovalStatus: (status: DocumentApprovalStatus | undefined) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  searchDocuments: (params?: Partial<DocumentSearchParams>) => Promise<void>;
  setPage: (page: number) => void;
  refresh: () => void;
  handlePageChange: (page: number) => void;
  itemsCount: number;
  itemsPerPage: number;
}

export interface DocumentAnalysisPanelProps {
  document?: PolicyDocument;
  file?: File;
  onAnalysisComplete?: () => void;
  onCategoryDetected?: (category: DocumentCategory) => void;
}

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete?: () => void;
  defaultCategory?: DocumentCategory;
  salesStage?: string;
  selectedDocument?: PolicyDocument;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
}

export interface AnalysisResult {
  categories: string[];
  confidence: number;
  metadata?: Record<string, any>;
}
