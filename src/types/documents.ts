
import { EntityType } from './common';

export type DocumentApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface PolicyDocument {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  category?: string;
  created_at: string;
  updated_at: string;
  uploaded_by: string;
  company_id: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  mime_type?: string;
  approval_status?: DocumentApprovalStatus;
  approval_notes?: string;
  approved_at?: string;
  description?: string;
  uploaded_by_name?: string;
}

export type Document = PolicyDocument; // Alias for backward compatibility

export type DocumentTableName = 
  | 'policy_documents' 
  | 'claim_documents' 
  | 'sales_documents' 
  | 'client_documents' 
  | 'insurer_documents' 
  | 'agent_documents' 
  | 'addendum_documents' 
  | 'invoice_documents';

export interface DocumentUploadParams {
  entityId: string;
  entityType: EntityType;
  file: File;
  documentName?: string;
  documentType?: string;
  category?: string;
  description?: string;
}

export interface DocumentUploadResult {
  success: boolean;
  document?: PolicyDocument;
  error?: string;
}
