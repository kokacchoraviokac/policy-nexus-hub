
export type EntityType = 
  | 'policy'
  | 'claim'
  | 'sale'
  | 'client'
  | 'insurer'
  | 'agent'
  | 'invoice'
  | 'addendum';

export type DocumentCategory = 
  | 'policy'
  | 'claim'
  | 'quote'
  | 'proposal'
  | 'contract'
  | 'invoice'
  | 'other';

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

export interface Document {
  id: string;
  document_name: string;
  document_type: DocumentType;
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
}

export interface DocumentUploadOptions {
  entityId: string;
  entityType: EntityType;
  defaultCategory?: DocumentCategory;
  selectedDocument?: Document;
  onSuccess?: () => void;
  salesStage?: string; // Added for sales documents
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
