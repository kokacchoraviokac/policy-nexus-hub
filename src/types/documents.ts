
export type DocumentCategory = 'policy' | 'claim' | 'client' | 'invoice' | 'other' | 'claim_evidence' | 'medical' | 'legal' | 'financial' | 'lien' | 'notification' | 'correspondence' | 'discovery' | 'quote' | 'proposal' | 'contract' | 'closeout';

export type DocumentApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs_review';

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
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  created_at: string;
  file_path: string;
  created_by_id: string;
  created_by_name: string;
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

export interface DocumentApprovalInfo {
  id: string;
  document_id: string;
  status: DocumentApprovalStatus;
  reviewer_id?: string;
  reviewer_name?: string;
  reviewed_at?: string;
  comments?: string;
}

export type EntityType = 'policy' | 'claim' | 'client' | 'invoice' | 'addendum' | 'sales_process' | 'agent' | 'insurer';

export interface DocumentSearchParams {
  searchTerm?: string;
  entityType?: EntityType;
  entityId?: string;
  category?: string;
  documentType?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: DocumentApprovalStatus;
  filterStatus?: string; // Add this property to fix error
}

export interface DocumentPreviewProps {
  document: Document;
  isOpen?: boolean;
  onClose?: () => void;
  open?: boolean; // Add this property
  onOpenChange?: (open: boolean) => void; // Add this property
}

export interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onDelete: (documentId: string) => void; // Changed to string type
  isDeleting: boolean;
  showUploadButton?: boolean;
  onUploadClick?: () => void;
  filterCategory?: string;
  onUploadVersion?: (document: Document) => void;
  onApprove?: (document: Document, status: DocumentApprovalStatus, notes?: string) => void;
}

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  selectedDocument?: Document;
  onUploadComplete?: () => void;
  defaultCategory?: string;
  salesStage?: string;
  additionalData?: Record<string, any>;
  onSuccess?: () => void;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
}

export interface DocumentSearchProps {
  filterStatus?: string;
}

export interface SalesProcessDocumentsProps {
  salesProcessId: string;
  currentStage?: string; // Add currentStage property
}
