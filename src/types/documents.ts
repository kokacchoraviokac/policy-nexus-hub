
import { DocumentCategory, EntityType } from './common';

export type DocumentTableName =
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents';

export enum DocumentApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review'
}

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type?: EntityType | string;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  company_id: string;
  created_at: string;
  updated_at?: string;
  category?: DocumentCategory | string;
  mime_type?: string;
  description?: string;
  tags?: string[];
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  approval_status?: DocumentApprovalStatus;
  approval_history?: DocumentApprovalHistoryItem[];
  comments?: DocumentComment[];
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  user_name?: string;
  comment: string;
  created_at: string;
}

export interface DocumentApprovalHistoryItem {
  id?: string;
  document_id: string;
  status: DocumentApprovalStatus;
  user_id: string;
  user_name?: string;
  notes?: string;
  created_at: string;
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

export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category?: DocumentCategory | string;
  entityId: string;
  entityType: EntityType | string;
  description?: string;
  tags?: string[];
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
}

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType | string;
  entityId: string;
  onUploadComplete?: () => void;
  defaultCategory?: DocumentCategory | string;
  salesStage?: string;
  selectedDocument?: Document;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
}

export interface DocumentListProps {
  entityType: EntityType | string;
  entityId: string;
  documents?: Document[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onDelete?: (documentId: string | Document) => void;
  isDeleting?: boolean;
  showUploadButton?: boolean;
  onUploadVersion?: (document: Document) => void;
  showApproval?: boolean;
  filterCategory?: string;
}

export interface DocumentAnalysisPanelProps {
  document: Document;
  isAnalyzing?: boolean;
  analysisError?: string | null;
  onAnalyze?: () => void;
  analysisResult?: any;
}

export interface ApprovalInfo {
  status: DocumentApprovalStatus;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  notes?: string;
}

export interface DocumentSearchParams {
  keyword?: string;
  entityType?: EntityType | string;
  documentType?: string;
  category?: DocumentCategory | string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface UseDocumentSearchProps {
  initialParams?: DocumentSearchParams;
}

export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  searchParams: DocumentSearchParams;
  setSearchParams: (params: DocumentSearchParams) => void;
  search: () => void;
  reset: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
}
