
import { EntityType } from "@/types/common";
import { DocumentCategory } from "@/types/documents";

export type DocumentTableName = 
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents';

/**
 * Get the document table name based on the entity type
 */
export const getDocumentTableName = (entityType: string): DocumentTableName => {
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
    case EntityType.ADDENDUM:
      return 'addendum_documents';
    case EntityType.INVOICE:
      return 'invoice_documents';
    default:
      return 'policy_documents'; // Default to policy documents
  }
};

/**
 * Get the entity ID field name based on the entity type
 */
export const getEntityIdFieldName = (entityType: string): string => {
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
    case EntityType.ADDENDUM:
      return 'addendum_id';
    case EntityType.INVOICE:
      return 'invoice_id';
    default:
      return 'entity_id';
  }
};

/**
 * Get the allowed document types for a given entity type
 */
export const getDocumentTypesForEntity = (entityType: string): string[] => {
  switch (entityType) {
    case EntityType.POLICY:
      return ['policy', 'certificate', 'terms', 'invoice', 'other'];
    case EntityType.CLAIM:
      return ['claim_form', 'damage_report', 'evidence', 'medical_report', 'other'];
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return ['quote', 'proposal', 'authorization', 'requirements', 'other'];
    case EntityType.CLIENT:
      return ['identification', 'financial', 'company', 'authorization', 'other'];
    case EntityType.INSURER:
      return ['agreement', 'commission', 'contacts', 'products', 'other'];
    case EntityType.AGENT:
      return ['contract', 'license', 'commission', 'training', 'other'];
    case EntityType.ADDENDUM:
      return ['addendum', 'amendment', 'supplement', 'other'];
    case EntityType.INVOICE:
      return ['invoice', 'receipt', 'payment', 'other'];
    default:
      return ['other'];
  }
};
