
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
  | 'invoice'
  | 'amendment'
  | 'contract'
  | 'identification'
  | 'authorization'
  | 'other';

export type DocumentApprovalStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_review';

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  category?: DocumentCategory;
  company_id?: string;
  created_at: string;
  updated_at?: string;
  is_latest_version?: boolean;
  version?: number;
  original_document_id?: string;
  mime_type?: string;
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  uploaded_by?: string;
  uploaded_by_name?: string;
  
  // Entity-specific IDs
  policy_id?: string;
  claim_id?: string;
  sales_process_id?: string;
  client_id?: string;
  insurer_id?: string;
  agent_id?: string;
  invoice_id?: string;
  addendum_id?: string;
  
  // Additional fields for sales processes
  step?: string;
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

export interface DocumentUploadRequest {
  documentName: string;
  documentType: string;
  category: DocumentCategory;
  file: File;
  entityType: EntityType;
  entityId: string;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
}

export interface DocumentSearchParams {
  searchTerm?: string;
  documentType?: string;
  category?: string;
  entityType?: EntityType;
  entityId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface UseDocumentSearchProps {
  entityType?: EntityType;
  entityId?: string;
  defaultParams?: Partial<DocumentSearchParams>;
}
