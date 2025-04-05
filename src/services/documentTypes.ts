
import { EntityType, DocumentCategory, DocumentApprovalStatus, Document } from "@/types/documents";

export interface PolicyDocument {
  id?: string;
  document_name: string;
  document_type: string;
  file_path: string;
  policy_id: string;
  uploaded_by: string;
  company_id: string;
  category?: DocumentCategory | string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  mime_type?: string;
  created_at?: string;
  updated_at?: string;
  addendum_id?: string;
}

export interface ClaimDocument {
  id?: string;
  document_name: string;
  document_type: string;
  file_path: string;
  claim_id: string;
  uploaded_by: string;
  company_id: string;
  category?: DocumentCategory | string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  mime_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SalesDocument {
  id?: string;
  document_name: string;
  document_type: string;
  file_path: string;
  sales_process_id: string;
  uploaded_by: string;
  company_id: string;
  category?: DocumentCategory | string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  mime_type?: string;
  created_at?: string;
  updated_at?: string;
  step?: string;
}

export interface ClientDocument {
  id?: string;
  document_name: string;
  document_type: string;
  file_path: string;
  client_id: string;
  uploaded_by: string;
  company_id: string;
  category?: DocumentCategory | string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  mime_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentUpdateStatus {
  approval_status: DocumentApprovalStatus;
  approval_notes?: string;
  approved_by: string;
  approved_at: string;
}

export type DocumentTableType = PolicyDocument | ClaimDocument | SalesDocument | ClientDocument;

export function mapEntityToTable(entityType: EntityType): string {
  const mapping: Record<EntityType, string> = {
    'policy': 'policy_documents',
    'claim': 'claim_documents',
    'sales_process': 'sales_documents',
    'client': 'client_documents',
    'insurer': 'insurer_documents',
    'agent': 'agent_documents'
  };
  
  return mapping[entityType];
}

export function mapDocumentToInterface(document: any, entityType: EntityType): Document {
  let mappedDoc: Document = {
    id: document.id,
    document_name: document.document_name,
    document_type: document.document_type,
    file_path: document.file_path,
    entity_type: entityType,
    entity_id: document[`${entityType.replace('_process', '')}_id`],
    uploaded_by: document.uploaded_by,
    company_id: document.company_id,
    category: document.category || 'other',
    created_at: document.created_at,
    updated_at: document.updated_at
  };
  
  // Add optional fields if they exist
  if (document.version) mappedDoc.version = document.version;
  if (document.is_latest_version !== undefined) mappedDoc.is_latest_version = document.is_latest_version;
  if (document.original_document_id) mappedDoc.original_document_id = document.original_document_id;
  if (document.mime_type) mappedDoc.mime_type = document.mime_type;
  if (document.step) mappedDoc.step = document.step;
  if (document.approval_status) mappedDoc.approval_status = document.approval_status;
  
  return mappedDoc;
}
