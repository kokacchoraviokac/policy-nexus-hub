
declare module '@/types/documents' {
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

  export type EntityType = 'policy' | 'claim' | 'client' | 'invoice' | 'addendum' | 'sales_process' | 'agent' | 'insurer';
}
