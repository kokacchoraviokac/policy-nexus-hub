
import { BaseEntity, EntityType as CommonEntityType } from "./common";

// Re-export EntityType to maintain backward compatibility
export { EntityType } from "./common";

// Filter state for codebook entities
export interface CodebookFilterState {
  status: 'all' | 'active' | 'inactive';
  country?: string;
  city?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  category?: string;
  insurer?: string;
}

// Define document-related enums
export enum DocumentCategory {
  POLICY = 'policy',
  CLAIM = 'claim',
  CLIENT = 'client',
  INVOICE = 'invoice',
  OTHER = 'other',
  CLAIM_EVIDENCE = 'claim_evidence',
  MEDICAL = 'medical',
  LEGAL = 'legal',
  FINANCIAL = 'financial',
  LIEN = 'lien', 
  NOTIFICATION = 'notification',
  CORRESPONDENCE = 'correspondence',
  DISCOVERY = 'discovery',
  QUOTE = 'quote',
  PROPOSAL = 'proposal',
  CONTRACT = 'contract',
  CLOSEOUT = 'closeout',
  SALES = 'sales',
  GENERAL = 'general',
  AUTHORIZATION = 'authorization',
  MISCELLANEOUS = 'miscellaneous'
}

export enum DocumentApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVIEW = 'needs_review'
}

// Document table name based on entity type
export type DocumentTableName =
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

// Client types
export interface Client extends BaseEntity {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_active: boolean;
  tax_id?: string;
  registration_number?: string;
  notes?: string;
}

// Insurer types
export interface Insurer extends BaseEntity {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  registration_number?: string;
  is_active: boolean;
  parent_company_id?: string;
  broker_code?: string;
}

// Insurance Product types
export interface InsuranceProduct extends BaseEntity {
  code: string;
  name: string;
  english_name?: string;
  description?: string;
  category: 'life' | 'non-life';
  is_active: boolean;
  insurer_id?: string;
  insurer_name?: string;
  name_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
  category_translations?: Record<string, string>;
}

// Contact Person types
export interface ContactPerson extends BaseEntity {
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary: boolean;
  entity_id: string;
  entity_type: 'client' | 'insurer';
}

// Base document interface
export interface Document extends BaseEntity {
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
  category?: DocumentCategory;
  mime_type?: string;
  description?: string;
  approval_status?: DocumentApprovalStatus;
  approved_at?: string;
  approved_by?: string;
  approval_notes?: string;
  comments?: Comment[];
  status?: string;
  size?: number;
}

// Comment interface for documents
export interface Comment {
  id: string;
  user_id: string;
  user_name?: string;
  content: string;
  created_at: string;
  document_id: string;
}

// Type for policy documents
export interface PolicyDocument extends Document {
  policy_id: string;
  addendum_id?: string;
}

// Type for claim documents
export interface ClaimDocument extends Document {
  claim_id: string;
}

// Type for sales documents
export interface SalesDocument extends Document {
  sales_process_id: string;
  step?: string;
}

// Document filter params
export interface DocumentFilterParams {
  entity_type?: EntityType;
  entity_id?: string;
  document_type?: string;
  category?: DocumentCategory;
  uploaded_by?: string;
  search_term?: string;
  date_from?: string;
  date_to?: string;
  approval_status?: DocumentApprovalStatus;
  is_latest_version?: boolean;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

// For backward compatibility - aliases to DocumentFilterParams
export type DocumentSearchParams = DocumentFilterParams;

// Document upload request interface
export interface DocumentUploadRequest {
  document_name: string;
  document_type: string;
  entity_type: EntityType;
  entity_id: string;
  file: File;
  category?: DocumentCategory;
  description?: string;
  original_document_id?: string;
  current_version?: number;
  meta?: Record<string, any>;
  step?: string;
}

// Document approval info
export interface ApprovalInfo {
  document_id: string;
  status: DocumentApprovalStatus;
  notes: string;
  canApprove: boolean;
}

// Document approval request
export interface DocumentApprovalRequest {
  document_id: string;
  status: DocumentApprovalStatus;
  notes?: string;
  entity_type: EntityType;
}

// Document upload dialog props
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

// Document upload options
export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category: DocumentCategory | string;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
  salesStage?: string;
  description?: string;
}

// Interface for the useDocumentSearch hook
export interface UseDocumentSearchProps {
  entityType?: EntityType;
  entityId?: string;
  initialFilters?: Partial<DocumentFilterParams>;
  defaultParams?: DocumentFilterParams;
  autoSearch?: boolean;
  category?: DocumentCategory;
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  initialSearchTerm?: string;
  approvalStatus?: DocumentApprovalStatus;
  initialSearchParams?: DocumentFilterParams;
  autoFetch?: boolean;
}

// Return type for useDocumentSearch
export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  filters: DocumentFilterParams;
  setFilters: (filters: Partial<DocumentFilterParams>) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  refetch: () => void;
  searchParams: DocumentFilterParams;
  setSearchParams: (params: Partial<DocumentFilterParams>) => void;
  search: () => void;
  totalCount: number;
  totalPages: number;
  resetSearch: () => void;
  searchTerm?: string;
}

// Return type for useDocuments hook
export interface UseDocumentsReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  deleteDocument: (documentId: string) => Promise<void>;
  isDeletingDocument: boolean;
  refetchDocuments: () => Promise<void>;
  documentsCount: number;
}

// For hooks that handle parameters
export interface UseDocumentUploadParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  salesStage?: string;
}
