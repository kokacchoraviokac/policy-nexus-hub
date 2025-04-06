
// Define document related types
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
  | 'contract'
  | 'invoice'
  | 'identification'
  | 'correspondence'
  | 'report'
  | 'legal'
  | 'other'
  | 'proposal'
  | 'quote'
  | 'discovery'
  | 'closeout';

export type DocumentApprovalStatus = 
  | 'approved'
  | 'rejected'
  | 'pending'
  | 'needs_review';

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  updated_at?: string;
  file_path: string;
  entity_type?: EntityType;
  entity_id: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  company_id: string;
  description?: string;
  version?: number;
  original_document_id?: string | null;
  is_latest_version?: boolean;
  mime_type?: string;
  category?: DocumentCategory;
  status?: string;
  approval_status?: DocumentApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
}

export const DOCUMENT_TABLES = [
  'policy_documents',
  'claim_documents',
  'sales_documents',
  'client_documents',
  'insurer_documents',
  'agent_documents',
  'invoice_documents',
  'addendum_documents'
] as const;

export type DocumentTableName = typeof DOCUMENT_TABLES[number];

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
  additionalMetadata?: Record<string, any>;
}

export interface DocumentAnalysisPanelProps {
  document?: Document;
  documentId?: string;
  documentUrl?: string;
  documentType?: string;
  file?: File;
  onAnalysisComplete?: () => void;
  onCategoryDetected?: (category: DocumentCategory) => void;
}

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

export interface DocumentSearchParams {
  entityType?: EntityType | EntityType[];
  entityId?: string;
  searchTerm?: string;
  category?: DocumentCategory | DocumentCategory[];
  documentType?: string | string[];
  dateFrom?: string;
  dateTo?: string;
  uploadedBy?: string;
  version?: number;
  isLatest?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PolicyImportInstructionsProps {
  className?: string;
}

export interface ProfileEditFormProps {
  user: User;
  updateUser?: (data: Partial<User>) => Promise<void>;
}

// Import User for the ProfileEditFormProps interface
import { User } from './auth/userTypes';
