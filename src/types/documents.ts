
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
  | 'discovery'
  | 'closeout';

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type?: EntityType;
  entity_id?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  version?: number;
  original_document_id?: string;
  mime_type?: string;
  is_latest_version?: boolean;
  category?: DocumentCategory;
}

export const DOCUMENT_TABLES = [
  'policy_documents',
  'claim_documents',
  'sales_documents',
  'client_documents',
  'insurer_documents',
  'agent_documents',
  'invoice_documents',
  'addendum_documents'
] as const;

export type DocumentTableName = typeof DOCUMENT_TABLES[number];

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete?: () => void;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
  defaultCategory?: DocumentCategory;
  salesStage?: string;
  selectedDocument?: Document;
}
