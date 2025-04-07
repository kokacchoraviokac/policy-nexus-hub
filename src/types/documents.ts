
// Document Types

// Define DocumentCategory as an enum for runtime availability
export enum DocumentCategory {
  POLICY = 'policy',
  CLAIM = 'claim',
  INVOICE = 'invoice',
  CONTRACT = 'contract',
  LIEN = 'lien',
  PROPOSAL = 'proposal',
  QUOTE = 'quote',
  NOTIFICATION = 'notification',
  OTHER = 'other',
  MISCELLANEOUS = 'miscellaneous'
}

// Define DocumentApprovalStatus as an enum
export enum DocumentApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review'
}

// Document base interface
export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_id: string;
  entity_type: EntityType;
  uploaded_by: string;
  uploaded_by_name?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  category?: DocumentCategory | string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  mime_type?: string;
  approval_status?: DocumentApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  comments?: string[];
}

// Define PolicyDocument extending the base Document
export interface PolicyDocument extends Document {
  policy_id?: string;
}

// Document types for different entities
export type ClaimDocument = Document & { claim_id: string };
export type SalesDocument = Document & { sales_process_id: string; step?: string };
export type ClientDocument = Document & { client_id: string };
export type InsurerDocument = Document & { insurer_id: string };
export type AgentDocument = Document & { agent_id: string };
export type InvoiceDocument = Document & { invoice_id: string };
export type AddendumDocument = Document & { addendum_id: string };

// Table names for document types
export type DocumentTableName = 
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents';

// Document upload response
export interface DocumentUploadResponse {
  success: boolean;
  documentId?: string;
  error?: string;
}

// Document search parameters
export interface DocumentSearchParams {
  searchTerm?: string;
  category?: DocumentCategory | string;
  entityType?: EntityType;
  entityId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  approvalStatus?: DocumentApprovalStatus;
}

// Props for document search hook
export interface UseDocumentSearchProps {
  entityType?: EntityType;
  entityId?: string;
  category?: DocumentCategory | string;
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  initialSearchTerm?: string;
  approvalStatus?: DocumentApprovalStatus;
  initialSearchParams?: Partial<DocumentSearchParams>;
  autoFetch?: boolean;
}

// Return type for document search hook
export interface UseDocumentSearchReturn {
  documents: PolicyDocument[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  selectedCategory: DocumentCategory | string | undefined;
  setSelectedCategory: (category: DocumentCategory | string | undefined) => void;
  selectedApprovalStatus: DocumentApprovalStatus | undefined;
  setSelectedApprovalStatus: (status: DocumentApprovalStatus | undefined) => void;
  searchDocuments: (params?: Partial<DocumentSearchParams>) => Promise<void>;
  refresh: () => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  itemsCount: number;
  itemsPerPage: number;
}

// Props for document analysis panel
export interface DocumentAnalysisPanelProps {
  document: Document;
  onClose?: () => void;
  showClose?: boolean;
}

// Document approval info
export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes?: string;
  approved_by?: string;
  approved_at?: string;
  action_type?: string;
}
