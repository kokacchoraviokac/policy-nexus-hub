
export type DocumentType = 
  | 'policy'
  | 'addendum'
  | 'claim'
  | 'invoice'
  | 'lien'
  | 'contract'
  | 'image'
  | 'other';

export type DocumentApprovalStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_review';  // Added this status

export type DocumentCategory = 
  | 'policy'
  | 'claim'
  | 'client'
  | 'invoice'
  | 'other'
  | 'claim_evidence'
  | 'medical'
  | 'legal'
  | 'financial'
  | 'lien'
  | 'notification'
  | 'correspondence'
  | 'discovery'
  | 'quote'
  | 'proposal'
  | 'contract'
  | 'closeout';

export type EntityType =
  | 'policy'
  | 'claim'
  | 'sales_process'
  | 'client'
  | 'insurer'
  | 'agent'
  | 'invoice'
  | 'addendum';

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;  // Added this property
  created_at: string;
  updated_at?: string;
  mime_type?: string;
  category?: DocumentCategory;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  company_id: string;
  description?: string;
}

export interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onDelete?: (document: Document) => void;
  isDeleting?: boolean;
  showUploadButton?: boolean;
  onUploadVersion?: (document: Document) => void;
  entityType: EntityType;
  entityId: string;
  refetch?: () => void;  // Added this property
  updateDocumentApproval?: (documentId: string, status: DocumentApprovalStatus, notes?: string) => Promise<void>;
}

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete?: () => void;
  defaultCategory?: DocumentCategory;  // Changed to allow DocumentCategory type
  salesStage?: string;
  selectedDocument?: Document;
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

export interface DocumentAnalysisPanelProps {
  document?: Document;
  documentId?: string;
  documentUrl?: string;
  documentType?: string;
  file?: File;
  onAnalysisComplete?: () => void;
  onCategoryDetected?: (category: string) => void;
}
