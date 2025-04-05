
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
  | 'rejected';

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
  created_at: string;
  updated_at?: string;
  mime_type?: string;
  category?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  company_id: string;
  description?: string; // Added this property
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
  refetch?: () => void;
  updateDocumentApproval?: (documentId: string, status: DocumentApprovalStatus, notes?: string) => Promise<void>;
}

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete: () => void;
  defaultCategory?: string;
  salesStage?: string;
}
