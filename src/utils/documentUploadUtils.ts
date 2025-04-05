
import { supabase } from "@/integrations/supabase/client";
import { EntityType } from "@/types/documents";
import { v4 as uuidv4 } from "uuid";

// Define the valid document table names
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
 * Get the corresponding document table name for an entity type
 */
export function getDocumentTableName(entityType: EntityType): DocumentTableName {
  const tableMap: Record<EntityType, DocumentTableName> = {
    'policy': 'policy_documents',
    'claim': 'claim_documents',
    'sales_process': 'sales_documents',
    'client': 'client_documents',
    'insurer': 'insurer_documents',
    'agent': 'agent_documents',
    'invoice': 'invoice_documents',
    'addendum': 'addendum_documents'
  };
  
  return tableMap[entityType];
}

/**
 * Upload a document file to Supabase storage
 */
export async function uploadDocumentFile(file: File, entityType: EntityType, entityId: string) {
  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `documents/${entityType}/${entityId}/${fileName}`;
  
  // Upload the file to Supabase storage
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, file);
    
  if (error) {
    throw error;
  }
  
  return filePath;
}

/**
 * Delete a document from storage
 */
export async function deleteDocumentFile(filePath: string) {
  try {
    const { error } = await supabase.storage
      .from('documents')
      .remove([filePath]);
      
    if (error) {
      console.error('Error deleting file from storage:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting file:', error);
    return false;
  }
}

/**
 * Construct a URL for a document file
 */
export function getDocumentUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
}
