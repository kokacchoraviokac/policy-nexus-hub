
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import type { EntityType } from "@/utils/activityLogger";
import type { DocumentTableName, DocumentCategory } from "@/types/documents";

// Map entity type to appropriate document table
export const getDocumentTable = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case "policy":
      return "policy_documents";
    case "claim":
      return "claim_documents";
    case "sales_process":
      return "sales_documents";
    default:
      return "policy_documents"; // fallback to policy_documents
  }
};

// Function to handle uploading file to storage
export const uploadFileToStorage = async (file: File, entityType: EntityType, entityId: string) => {
  // Generate unique ID and file path
  const documentId = uuidv4();
  const fileExt = file.name.split('.').pop();
  const filePath = `${entityType}/${entityId}/${documentId}.${fileExt}`;
  
  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (uploadError) {
    throw uploadError;
  }
  
  return { documentId, filePath, fileExt };
};

// Function to insert document metadata into database
export const insertDocumentRecord = async (
  documentTable: DocumentTableName,
  documentData: {
    id: string;
    document_name: string;
    document_type: string;
    file_path: string;
    uploaded_by: string;
    company_id: string;
    version: number;
    is_latest_version: boolean;
    original_document_id?: string | null;
    category?: DocumentCategory | null;
    approval_status?: string;
    [key: string]: any; // For entity-specific fields
  }
) => {
  // Remove fields that don't exist in the database table
  const dbFieldsToSend = { ...documentData };
  
  // Determine which fields to include based on table name
  if (documentTable === "claim_documents") {
    // Claim documents table might not have all fields
    delete dbFieldsToSend.version;
    delete dbFieldsToSend.is_latest_version;
    delete dbFieldsToSend.original_document_id;
    delete dbFieldsToSend.category;
    delete dbFieldsToSend.approval_status;
  }
  
  const { error: insertError } = await supabase
    .from(documentTable)
    .insert(dbFieldsToSend);
    
  if (insertError) {
    throw insertError;
  }
  
  return documentData;
};

// Helper function to create document data based on entity type
export const createDocumentData = (
  baseData: {
    id: string;
    document_name: string;
    document_type: string;
    file_path: string;
    uploaded_by: string;
    company_id: string | any;
    version: number;
    is_latest_version: boolean;
    original_document_id?: string | null;
    category?: DocumentCategory | null;
    approval_status?: string;
  },
  entityType: EntityType,
  entityId: string
) => {
  // Add the entity ID field based on the entity type
  if (entityType === "policy") {
    return {
      ...baseData,
      policy_id: entityId
    };
  } else if (entityType === "claim") {
    return {
      ...baseData,
      claim_id: entityId
    };
  } else if (entityType === "sales_process") {
    return {
      ...baseData,
      sales_process_id: entityId
    };
  } else {
    // Fallback to policy_id if entityType is not one of the above
    return {
      ...baseData,
      policy_id: entityId
    };
  }
};
