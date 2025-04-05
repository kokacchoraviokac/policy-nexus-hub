
// Define the types of entities a document can be associated with
export type EntityType = 
  | 'policy'
  | 'claim'
  | 'sales_process'
  | 'client'
  | 'insurer'
  | 'agent';

// Document approval status options
export type DocumentApprovalStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_review';

// Document category options
export type DocumentCategory = 
  | 'policy'
  | 'claim'
  | 'quote'
  | 'proposal'
  | 'contract'
  | 'invoice'
  | 'amendment'
  | 'authorization'
  | 'identification'
  | 'financial'
  | 'report'
  | 'evidence'
  | 'certificate'
  | 'agreement'
  | 'license'
  | 'other';

// Main Document interface
export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  
  // User info
  uploaded_by: string;
  uploaded_by_id?: string;
  uploaded_by_name?: string;
  company_id: string;
  
  // Metadata
  created_at: string;
  category?: DocumentCategory | string;
  description?: string;
  status?: string;
  tags?: string[];
  
  // Version control
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  
  // Technical details
  mime_type?: string | null;
  file_size?: number;
  file_extension?: string;
  
  // Approval information
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
}

// Type for document search parameters
export interface DocumentSearchParams {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  documentType?: string;
  category?: string;
  entityType?: EntityType;
  entityId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  uploadedBy?: string;
}
