
import { EntityType, DocumentCategory, ApprovalStatus, DocumentComment } from "@/types/common";

export enum DocumentApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  entity_type: string;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  category?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  mime_type?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  description?: string;
  status?: ApprovalStatus;
  approval_status?: DocumentApprovalStatus;
  comments?: (DocumentComment | string)[];
  policy_id?: string;
  claim_id?: string;
  sales_process_id?: string;
  client_id?: string;
  insurer_id?: string;
  agent_id?: string;
  invoice_id?: string;
  addendum_id?: string;
  approval_notes?: string;
  approved_at?: string;
  approved_by?: string;
}

export interface PolicyDocument extends Document {
  policy_id: string;
}

export interface ClaimDocument extends Document {
  claim_id: string;
}

export interface SalesDocument extends Document {
  sales_process_id: string;
  step?: string;
}

export interface ClientDocument extends Document {
  client_id: string;
}

export interface InsurerDocument extends Document {
  insurer_id: string;
}

export interface AgentDocument extends Document {
  agent_id: string;
}

export interface InvoiceDocument extends Document {
  invoice_id: string;
}

export interface AddendumDocument extends Document {
  addendum_id: string;
}

export type DocumentTableName =
  | "policy_documents"
  | "claim_documents"
  | "sales_documents"
  | "client_documents"
  | "insurer_documents"
  | "agent_documents"
  | "invoice_documents"
  | "addendum_documents";

export interface DocumentAnalysisPanelProps {
  file: File;
  onAnalysisComplete: () => void;
  onCategoryDetected: (category: DocumentCategory | string) => void;
}

export interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category?: DocumentCategory | string;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
  description?: string;
}

export interface UpdateApprovalParams {
  documentId: string;
  entityType: EntityType;
  status: DocumentApprovalStatus;
  notes?: string;
}

export interface DocumentSearchParams {
  entityType?: string;
  entityId?: string;
  category?: string;
  searchTerm?: string;
  status?: string;
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UseDocumentSearchProps {
  defaultParams?: DocumentSearchParams;
  autoSearch?: boolean;
}

export interface UseDocumentSearchReturn {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  searchParams: DocumentSearchParams;
  setSearchParams: (params: DocumentSearchParams) => void;
  search: () => Promise<void>;
  resetSearch: () => void;
}

export interface ApprovalInfo {
  status: DocumentApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete?: () => void;
  defaultCategory?: string;
  salesStage?: string;
  selectedDocument?: Document;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
}

export interface DocumentListProps {
  entityType: EntityType;
  entityId: string;
  onUploadClick?: () => void;
  showUploadButton?: boolean;
  showApproval?: boolean;
  filterCategory?: string;
  documents?: Document[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onDelete?: (documentId: string | Document) => void;
  isDeleting?: boolean;
  onUploadVersion?: (document: Document) => void;
}
