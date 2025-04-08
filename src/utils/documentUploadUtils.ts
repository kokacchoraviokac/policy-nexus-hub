
import { EntityType, DocumentTableName } from "@/types/documents";

/**
 * Converts an EntityType to the corresponding document table name
 * @param entityType The entity type
 * @returns Document table name
 */
export const asTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case EntityType.POLICY:
      return "policy_documents";
    case EntityType.CLAIM:
      return "claim_documents";
    case EntityType.CLIENT:
      return "client_documents";
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return "sales_documents";
    case EntityType.AGENT:
      return "agent_documents";
    case EntityType.INSURER:
      return "insurer_documents";
    case EntityType.INVOICE:
      return "invoice_documents";
    case EntityType.ADDENDUM:
      return "addendum_documents";
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
};

/**
 * Maps document table name to a user-friendly entity label
 * @param tableName Document table name
 * @returns User-friendly entity label
 */
export const getEntityLabel = (tableName: DocumentTableName): string => {
  switch (tableName) {
    case "policy_documents":
      return "Policy";
    case "claim_documents":
      return "Claim";
    case "client_documents":
      return "Client";
    case "sales_documents":
      return "Sales";
    case "agent_documents":
      return "Agent";
    case "insurer_documents":
      return "Insurer";
    case "invoice_documents":
      return "Invoice";
    case "addendum_documents":
      return "Addendum";
    default:
      return "Document";
  }
};

/**
 * Gets the entity type from a document table name
 * @param tableName Document table name
 * @returns EntityType
 */
export const getEntityTypeFromTable = (tableName: DocumentTableName): EntityType => {
  switch (tableName) {
    case "policy_documents":
      return EntityType.POLICY;
    case "claim_documents":
      return EntityType.CLAIM;
    case "client_documents":
      return EntityType.CLIENT;
    case "sales_documents":
      return EntityType.SALES_PROCESS;
    case "agent_documents":
      return EntityType.AGENT;
    case "insurer_documents":
      return EntityType.INSURER;
    case "invoice_documents":
      return EntityType.INVOICE;
    case "addendum_documents":
      return EntityType.ADDENDUM;
    default:
      throw new Error(`Unknown table name: ${tableName}`);
  }
};

/**
 * Get file extension from a filename
 * @param filename Filename including extension
 * @returns File extension without the dot (e.g., "pdf")
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
};

/**
 * Get an icon based on file extension
 * @param filename Filename or extension
 * @returns Icon name for the file type
 */
export const getFileIcon = (filename: string): string => {
  const extension = filename.includes(".") ? getFileExtension(filename) : filename.toLowerCase();
  
  switch (extension) {
    case "pdf":
      return "file-pdf";
    case "doc":
    case "docx":
      return "file-text";
    case "xls":
    case "xlsx":
    case "csv":
      return "file-spreadsheet";
    case "ppt":
    case "pptx":
      return "file-presentation";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
      return "image";
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return "archive";
    default:
      return "file";
  }
};
