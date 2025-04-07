
import { DocumentTableName, EntityType } from "@/types/documents";

export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
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
    case EntityType.ADDENDUM:
      return 'addendum_documents';
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
};

export const getEntityTypeFromTableName = (tableName: DocumentTableName): EntityType => {
  switch (tableName) {
    case 'policy_documents':
      return EntityType.POLICY;
    case 'claim_documents':
      return EntityType.CLAIM;
    case 'sales_documents':
      return EntityType.SALES_PROCESS;
    case 'client_documents':
      return EntityType.CLIENT;
    case 'insurer_documents':
      return EntityType.INSURER;
    case 'agent_documents':
      return EntityType.AGENT;
    case 'invoice_documents':
      return EntityType.INVOICE;
    case 'addendum_documents':
      return EntityType.ADDENDUM;
    default:
      throw new Error(`Unsupported table name: ${tableName}`);
  }
};

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExtension = originalName.split('.').pop() || '';
  
  return `${timestamp}-${randomString}.${fileExtension}`;
};
