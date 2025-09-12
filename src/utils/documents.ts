
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { EntityType } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";

interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category: string;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
}

export const uploadDocument = async (options: DocumentUploadOptions) => {
  const { 
    file, 
    documentName, 
    documentType, 
    category, 
    entityId, 
    entityType,
    originalDocumentId,
    currentVersion = 0
  } = options;

  try {
    // Get user for uploading
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `documents/${entityType}/${entityId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading document:", uploadError);
      throw uploadError;
    }

    // Determine table name based on entity type
    const tableName = getDocumentTableName(entityType);

    // Calculate new version if it's a version update
    const version = currentVersion > 0 ? currentVersion + 1 : 1;

    // Create document record in database with appropriate field names
    // based on the entity type
    // Create base document data
    const baseDocumentData = {
      document_name: documentName,
      document_type: documentType,
      file_path: filePath,
      uploaded_by: user.id,
      company_id: user?.user_metadata?.['company_id'] as string,
      category: category || "other",
      version: version,
      is_latest_version: true,
      mime_type: file.type,
      original_document_id: originalDocumentId || null
    };

    // Create typed document data based on table type
    let documentData: any;
    if (tableName === "policy_documents") {
      documentData = { ...baseDocumentData, policy_id: entityId };
    } else if (tableName === "claim_documents") {
      documentData = { ...baseDocumentData, claim_id: entityId };
    } else if (tableName === "sales_documents") {
      documentData = { ...baseDocumentData, sales_process_id: entityId };
    } else {
      documentData = baseDocumentData;
    }

    // Insert the document record using the resolved table name
    const { data, error: dbError } = await supabase
      .from(tableName)
      .insert(documentData)
      .select()
      .single();

    if (dbError) {
      console.error("Error creating document record:", dbError);
      
      // Try to clean up the uploaded file on db error
      await supabase.storage
        .from('documents')
        .remove([filePath]);
        
      throw dbError;
    }

    // If this is a new version, update previous version
    if (originalDocumentId) {
      await supabase
        .from(tableName)
        .update({ is_latest_version: false })
        .eq('id', originalDocumentId);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Document upload failed:", error);
    return { success: false, error };
  }
};
