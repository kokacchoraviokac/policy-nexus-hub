
import { EntityType } from '@/types/documents';

// Define acceptable document table names in Supabase
export type DocumentTableName = 
  | 'policy_documents'
  | 'claim_documents'
  | 'sales_documents'
  | 'client_documents'
  | 'insurer_documents'
  | 'agent_documents'
  | 'invoice_documents'
  | 'addendum_documents';

// Maps entity types to their corresponding document table names
export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  const tableMapping: Record<EntityType, DocumentTableName> = {
    'policy': 'policy_documents',
    'claim': 'claim_documents',
    'sales_process': 'sales_documents',
    'client': 'client_documents',
    'insurer': 'insurer_documents',
    'agent': 'agent_documents',
    'invoice': 'invoice_documents',
    'addendum': 'addendum_documents'
  };
  
  return tableMapping[entityType];
};

// Maps entity types to their corresponding ID column names
export const getEntityIdColumn = (entityType: EntityType): string => {
  const idColumnMapping: Record<EntityType, string> = {
    'policy': 'policy_id',
    'claim': 'claim_id',
    'sales_process': 'sales_process_id',
    'client': 'client_id',
    'insurer': 'insurer_id',
    'agent': 'agent_id',
    'invoice': 'invoice_id',
    'addendum': 'addendum_id'
  };
  
  return idColumnMapping[entityType];
};

// Get the appropriate document categories for a given entity type
export const getDocumentCategories = (entityType: EntityType): string[] => {
  const categoryMapping: Record<EntityType, string[]> = {
    'policy': ['policy', 'invoice', 'amendment', 'contract', 'other'],
    'claim': ['claim_form', 'evidence', 'report', 'invoice', 'other'],
    'sales_process': ['quote', 'proposal', 'contract', 'authorization', 'other'],
    'client': ['identification', 'authorization', 'financial', 'other'],
    'insurer': ['agreement', 'certificate', 'report', 'other'],
    'agent': ['contract', 'license', 'identification', 'other'],
    'invoice': ['invoice', 'financial', 'other'],
    'addendum': ['amendment', 'contract', 'other']
  };
  
  return categoryMapping[entityType];
};

// Validate if a file type is acceptable for document upload
export const isValidDocumentType = (fileType: string): boolean => {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  return validTypes.includes(fileType);
};
