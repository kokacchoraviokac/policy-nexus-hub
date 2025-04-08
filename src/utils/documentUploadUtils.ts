
import { EntityType, DocumentTableName } from "@/types/documents";

/**
 * Maps an entity type to its corresponding document table name
 * @param entityType Entity type
 * @returns Document table name
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_documents';
    case EntityType.CLAIM:
      return 'claim_documents';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'sales_documents';
    case EntityType.CLIENT:
      return 'client_documents';
    case EntityType.INSURER:
      return 'insurer_documents';
    case EntityType.AGENT:
      return 'agent_documents';
    case EntityType.INVOICE:
      return 'invoice_documents';
    case EntityType.POLICY_ADDENDUM:
      return 'addendum_documents';
    default:
      return 'policy_documents'; // Default fallback
  }
}

/**
 * Gets the correct entity ID column name for a given entity type
 * @param entityType Entity type
 * @returns Entity ID column name
 */
export function getEntityIdColumn(entityType: EntityType): string {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_id';
    case EntityType.CLAIM:
      return 'claim_id';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'sales_process_id';
    case EntityType.CLIENT:
      return 'client_id';
    case EntityType.INSURER:
      return 'insurer_id';
    case EntityType.AGENT:
      return 'agent_id';
    case EntityType.INVOICE:
      return 'invoice_id';
    case EntityType.POLICY_ADDENDUM:
      return 'addendum_id';
    default:
      return 'entity_id'; // Fallback to generic column
  }
}

/**
 * Gets allowed document types for a specific entity type
 * @param entityType Entity type
 * @returns Array of document types
 */
export function getAllowedDocumentTypes(entityType: EntityType): string[] {
  const commonTypes = ['General', 'Contract', 'Correspondence', 'Other'];
  
  switch (entityType) {
    case EntityType.POLICY:
      return [...commonTypes, 'Policy', 'Endorsement', 'Certificate', 'Application'];
    case EntityType.CLAIM:
      return [...commonTypes, 'Claim Form', 'Photos', 'Medical Report', 'Invoice', 'Expert Opinion'];
    case EntityType.SALES_PROCESS:
      return [...commonTypes, 'Proposal', 'Quote', 'Requirements', 'Client Authorization'];
    case EntityType.CLIENT:
      return [...commonTypes, 'ID', 'Registration', 'Financial Report'];
    case EntityType.INSURER:
      return [...commonTypes, 'Agreement', 'Rate Sheet', 'Product Info'];
    case EntityType.INVOICE:
      return [...commonTypes, 'Invoice', 'Receipt', 'Statement'];
    default:
      return commonTypes;
  }
}

/**
 * Generates a unique filename for uploaded documents
 * @param originalFilename Original filename
 * @returns Unique filename
 */
export function generateUniqueFilename(originalFilename: string): string {
  const extension = originalFilename.split('.').pop() || '';
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Gets the storage path for a document
 * @param entityType Entity type
 * @param entityId Entity ID
 * @param filename Filename
 * @returns Storage path
 */
export function getDocumentStoragePath(entityType: EntityType, entityId: string, filename: string): string {
  return `${entityType.toLowerCase()}/${entityId}/${filename}`;
}

/**
 * Validates that a file is of an allowed type
 * @param file File to validate
 * @returns True if valid, false otherwise
 */
export function isValidDocumentType(file: File): boolean {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/tiff',
    'application/zip',
    'text/plain',
    'application/rtf'
  ];
  
  return allowedMimeTypes.includes(file.type);
}

/**
 * Gets the maximum allowed file size in bytes
 * @returns Maximum file size in bytes
 */
export function getMaxFileSize(): number {
  return 10 * 1024 * 1024; // 10MB
}
