
import { DocumentCategory, EntityType, ApprovalStatus } from "./common";

export { DocumentCategory, EntityType, ApprovalStatus };

export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_id?: string;
  uploaded_by_name?: string;
  description?: string;
  version?: number;
  status?: string;
  tags?: string[];
  category: DocumentCategory;
  company_id: string;
  
  mime_type?: string;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  approval_status?: DocumentApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  comments?: string[];
}

export interface DocumentUploadRequest {
  document_name: string;
  document_type: string;
  entity_type: string;
  entity_id: string;
  description?: string;
  tags?: string[];
  category: DocumentCategory;
  file: File;
}

export type DocumentTableName = 
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents';

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete?: () => void;
  defaultCategory?: string;
  salesStage?: string;
  selectedDocument?: Document;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
}

export interface PolicyDocument extends Document {
  policy_id: string;
  addendum_id?: string;
}

export interface Comment {
  id?: string;
  author: string;
  text: string;
  document_id?: string;
  user_id?: string;
  created_at?: string;
}

export interface DocumentUploadOptions {
  tableName?: DocumentTableName;
  onSuccess?: (document: Document) => void;
  onError?: (error: Error) => void;
}

export interface DocumentSearchParams {
  entity_type?: EntityType;
  entity_id?: string;
  category?: DocumentCategory;
  search_term?: string;
  date_from?: string;
  date_to?: string;
  uploaded_by?: string;
  page?: number;
  limit?: number;
}

export interface UseDocumentSearchProps {
  defaultParams?: Partial<DocumentSearchParams>;
}

export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  setSearchParams: (params: Partial<DocumentSearchParams>) => void;
  searchParams: DocumentSearchParams;
  totalCount: number;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export interface ApprovalInfo {
  status: DocumentApprovalStatus;
  approvedBy?: {
    id: string;
    name: string;
  };
  approvedAt?: string;
  notes?: string;
  canApprove: boolean;
}

export interface DocumentAnalysisPanelProps {
  document: Document;
  onAnalysisComplete?: (results: any) => void;
}
