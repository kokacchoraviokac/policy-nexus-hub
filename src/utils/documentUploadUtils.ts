
import { EntityType } from "@/types/common";
import { DocumentTableName } from "@/types/documents";

/**
 * Get the table name for documents based on entity type
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
  switch (entityType) {
    case EntityType.POLICY:
      return "policy_documents";
    case EntityType.CLAIM:
      return "claim_documents";
    case EntityType.SALES_PROCESS:
      return "sales_documents";
    case EntityType.CLIENT:
      return "client_documents";
    case EntityType.INSURER:
      return "insurer_documents";
    case EntityType.AGENT:
      return "agent_documents";
    case EntityType.INVOICE:
      return "invoice_documents";
    case EntityType.POLICY_ADDENDUM:
    case EntityType.ADDENDUM:
      return "addendum_documents";
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
}

/**
 * Get the entity-specific ID column name
 */
export function getEntityIdColumn(entityType: EntityType): string {
  switch (entityType) {
    case EntityType.POLICY:
      return "policy_id";
    case EntityType.CLAIM:
      return "claim_id";
    case EntityType.SALES_PROCESS:
      return "sales_process_id";
    case EntityType.CLIENT:
      return "client_id";
    case EntityType.INSURER:
      return "insurer_id";
    case EntityType.AGENT:
      return "agent_id";
    case EntityType.INVOICE:
      return "invoice_id";
    case EntityType.POLICY_ADDENDUM:
    case EntityType.ADDENDUM:
      return "addendum_id";
    default:
      return "entity_id";
  }
}

/**
 * Validate if the document file type is allowed
 */
export function isAllowedFileType(file: File): boolean {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/msword', // doc
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'text/csv'
  ];
  
  return allowedTypes.includes(file.type);
}

/**
 * Get the mime type of a file
 */
export function getMimeType(file: File): string {
  return file.type || 'application/octet-stream';
}

/**
 * Create a storage path for a document
 */
export function createStoragePath(entityType: EntityType, entityId: string, fileName: string): string {
  const normalizedEntityType = entityType.toLowerCase().replace(/_/g, '-');
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${normalizedEntityType}/${entityId}/${timestamp}_${sanitizedFileName}`;
}
