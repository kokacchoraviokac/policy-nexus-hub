
import { EntityType } from './common';

export type { EntityType }; // Re-export from common for backward compatibility

export type DocumentCategory = 
  | 'policy' 
  | 'claim' 
  | 'invoice' 
  | 'contract' 
  | 'identification' 
  | 'other';

export type DocumentApprovalStatus = 
  | 'approved' 
  | 'rejected' 
  | 'pending' 
  | 'needs_review';

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  mime_type?: string;
  approval_status?: DocumentApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
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
  file?: File;
  onAnalysisComplete?: () => void;
  onCategoryDetected?: (category: DocumentCategory) => void;
}

export enum DocumentTableName {
  POLICY = "policy_documents",
  CLAIM = "claim_documents",
  SALES = "sales_documents",
  CLIENT = "client_documents",
  INSURER = "insurer_documents",
  AGENT = "agent_documents",
  INVOICE = "invoice_documents",
  ADDENDUM = "addendum_documents"
}
