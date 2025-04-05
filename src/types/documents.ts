
export type EntityType = "policy" | "claim" | "client" | "insurer" | "sales_process" | "agent";

export type DocumentCategory = 
  | "policy" 
  | "claim" 
  | "invoice" 
  | "legal" 
  | "correspondence" 
  | "other"
  | "discovery"
  | "quote"
  | "proposal"
  | "contract"
  | "closeout";

export type DocumentApprovalStatus = 
  | "pending" 
  | "approved" 
  | "rejected" 
  | "needs_review";

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by: string;
  company_id: string;
  category?: DocumentCategory;
  created_at: string;
  updated_at?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  mime_type?: string;
  description?: string;
  tags?: string[];
  status?: string;
  approval_status?: DocumentApprovalStatus;
  uploaded_by_name?: string;
  uploaded_by_id?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  metadata?: any;
  step?: string;
}

export interface DocumentTableMapping {
  policy: 'policy_documents';
  claim: 'claim_documents';
  sales_process: 'sales_documents';
  client: 'client_documents';
  insurer: 'insurer_documents';
  agent: 'agent_documents';
  [key: string]: string;
}

export interface DocumentSearchParams {
  searchTerm?: string;
  category?: string;
  documentType?: string;
  dateFrom?: string;
  dateTo?: string;
  entityType?: EntityType;
  entityId?: string;
  status?: string;
}

export interface DocumentAnalysisPanelProps {
  documentId: string;
  documentUrl: string;
  documentType: string;
  file?: File | null;
  onAnalysisComplete?: (result: any) => void;
  onCategoryDetected?: (category: string) => void;
}
