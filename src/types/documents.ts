
export type EntityType = 
  | 'policy' 
  | 'claim' 
  | 'sales_process' 
  | 'client' 
  | 'insurer' 
  | 'agent' 
  | 'invoice' 
  | 'addendum';

export type DocumentCategory = 
  | 'policy' 
  | 'claim' 
  | 'contract' 
  | 'invoice' 
  | 'identification'
  | 'correspondence'
  | 'report'
  | 'legal'
  | 'other'
  | 'proposal'
  | 'quote'
  | 'medical'
  | 'financial'
  | 'lien'
  | 'notification'
  | 'discovery'
  | 'closeout'
  | 'claim_evidence'
  | 'company'
  | 'amendment'
  | 'authorization';

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
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_id?: string;
  uploaded_by_name?: string;
  company_id: string;
  description?: string;
  version?: number;
  original_document_id?: string | null;
  is_latest_version?: boolean;
  mime_type?: string;
  category?: DocumentCategory;
  status?: string;
  approval_status?: DocumentApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  tags?: string[];
}

export interface DocumentUploadStateProps {
  entityId: string;
  entityType: EntityType;
  defaultCategory?: DocumentCategory;
  selectedDocument?: Document;
  onSuccess?: () => void;
}

export interface DocumentSearchParams {
  entityType?: EntityType | EntityType[];
  entityId?: string;
  searchTerm?: string;
  category?: string;
  documentType?: string;
  dateFrom?: string;
  dateTo?: string;
  uploadedBy?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UseDocumentSearchProps {
  entityType?: EntityType | EntityType[];
  entityId?: string;
  initialSearchParams?: DocumentSearchParams;
  page?: number;
  pageSize?: number;
}

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete?: () => void;
  onFileSelected?: (file: File | null) => void;
  embedMode?: boolean;
  defaultCategory?: DocumentCategory;
  salesStage?: string;
  selectedDocument?: Document;
}

export interface DocumentAnalysisPanelProps {
  document?: Document;
  documentId?: string;
  documentUrl?: string;
  documentType?: string;
  file?: File;
  onAnalysisComplete?: () => void;
  onCategoryDetected?: (category: DocumentCategory) => void;
}

export interface DocumentUploadRequest {
  document_name: string;
  document_type: string;
  entity_type: EntityType;
  entity_id: string;
  description?: string;
  tags?: string[];
  category: DocumentCategory;
  file: File;
}
