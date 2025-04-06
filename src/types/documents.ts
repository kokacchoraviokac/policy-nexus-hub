
import { EntityType } from "./common";

export type DocumentCategory = 
  | 'policy'
  | 'claim'
  | 'quote'
  | 'proposal'
  | 'contract'
  | 'invoice'
  | 'other'
  | 'identification'
  | 'financial'
  | 'medical'
  | 'legal'
  | 'notification'
  | 'lien';

export type DocumentType = 
  | 'application'
  | 'policy'
  | 'endorsement'
  | 'invoice'
  | 'claim'
  | 'correspondence'
  | 'photo'
  | 'report'
  | 'quote'
  | 'proposal'
  | 'other';

export type DocumentRelation =
  | 'claim_documents'
  | 'policy_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents';

export type DocumentTableName = DocumentRelation;

export type DocumentApprovalStatus = 
  | 'approved'
  | 'rejected'
  | 'pending'
  | 'needs_review';

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  updated_at: string;
  uploaded_by: string;
  file_path: string;
  mime_type?: string;
  category?: DocumentCategory;
  entity_id?: string;
  entity_type?: EntityType;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  
  // Approval-related fields
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  
  // Additional fields
  description?: string;
  uploaded_by_name?: string;
  company_id?: string;
  salesStage?: string;
}

export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category: string;
  entityType: EntityType;
  entityId: string;
  originalDocumentId?: string | null;
  currentVersion?: number;
  salesStage?: string;
  description?: string;
}

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

export interface DocumentAnalysisPanelProps {
  document?: Document;
  documentId?: string;
  documentUrl?: string;
  documentType?: string;
  file?: File;
  onAnalyze?: () => void;
  onAnalysisComplete?: () => void;
  onCategoryDetected?: (category: DocumentCategory) => void;
}

export interface DocumentSearchParams {
  entityType: EntityType;
  entityId?: string;
  category?: DocumentCategory;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  approvalStatus?: DocumentApprovalStatus;
}

export interface UseDocumentSearchProps {
  entityType: EntityType;
  entityId?: string;
  category?: DocumentCategory;
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  initialSearchTerm?: string;
  approvalStatus?: DocumentApprovalStatus;
  pageSize?: number;
}

export interface UseDocumentSearchReturn {
  documents: Document[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  selectedCategory: DocumentCategory | undefined;
  setSelectedCategory: (category?: DocumentCategory) => void;
  selectedApprovalStatus: DocumentApprovalStatus | undefined;
  setSelectedApprovalStatus: (status?: DocumentApprovalStatus) => void;
  searchDocuments: (params?: Partial<DocumentSearchParams>) => Promise<void>;
  currentPage: number;
  handlePageChange: (page: number) => void;
  refetch: (params?: Partial<DocumentSearchParams>) => Promise<void>;
}
