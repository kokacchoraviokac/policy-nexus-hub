
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { DocumentCategory, EntityType } from "@/types/documents";

// Document table mapping - make this a literal string union type
export type DocumentTableName = 
  | 'policy_documents'
  | 'claim_documents'
  | 'client_documents'
  | 'invoice_documents'
  | 'addendum_documents'
  | 'sales_documents'
  | 'agent_documents'
  | 'insurer_documents';

// Get the table name for a given entity type
export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case 'policy':
      return 'policy_documents';
    case 'claim':
      return 'claim_documents';
    case 'client':
      return 'client_documents';
    case 'invoice':
      return 'invoice_documents';
    case 'addendum':
      return 'addendum_documents';
    case 'sales_process':
      return 'sales_documents';
    case 'agent':
      return 'agent_documents';
    case 'insurer':
      return 'insurer_documents';
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
};

// Upload document helper function
export const uploadDocumentFile = async (
  file: File,
  entityType: EntityType,
  entityId: string
): Promise<string> => {
  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `documents/${entityType}/${entityId}/${fileName}`;
  
  // Upload the file to storage
  const { error } = await supabase.storage
    .from('documents')
    .upload(filePath, file);
  
  if (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
  
  return filePath;
};
