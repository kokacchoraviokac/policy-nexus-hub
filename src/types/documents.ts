
export type EntityType = 
  | "policy"
  | "claim"
  | "client" 
  | "insurer"
  | "sales_process"
  | "agent"
  | "invoice"
  | "addendum";

export type DocumentApprovalStatus = 
  | "pending"
  | "approved"
  | "rejected"
  | "needs_review";

export type DocumentCategory = 
  | "policy"
  | "claim"
  | "client"
  | "invoice"
  | "legal"
  | "correspondence"
  | "discovery"
  | "quote"
  | "proposal"
  | "contract"
  | "closeout"
  | "other";

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  category?: DocumentCategory | string;
  file_path: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  mime_type?: string;
  entity_id: string;
  entity_type: EntityType;
  uploaded_by: string;
  uploaded_by_name?: string;
  company_id: string;
  created_at: string;
  updated_at?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  metadata?: Record<string, any> | string;
}

export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category: DocumentCategory | string;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
  additionalData?: Record<string, any>;
}

export interface ErrorResponse {
  code?: string;
  message: string;
  details?: any;
}
