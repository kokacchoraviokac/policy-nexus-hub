
export type DocumentCategory = 'policy' | 'claim' | 'client' | 'invoice' | 'other';

export type DocumentApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs_review';

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by_id: string;
  uploaded_by_name: string;
  description?: string;
  version?: number;
  status?: string;
  tags?: string[];
  category: DocumentCategory;
  
  // Add missing properties
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
