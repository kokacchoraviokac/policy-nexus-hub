
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DocumentUploadOptions, EntityType } from "@/types/documents";
import { getDocumentTableName, getEntityIdColumn } from "@/utils/documentUploadUtils";
import { fromDocumentTable } from "@/utils/supabaseTypeAssertions";

/**
 * Hook for uploading documents with file handling and database operations
 */
export const useUploadDocument = () => {
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadDocument = async (options: DocumentUploadOptions) => {
    const { 
      file, 
      documentName, 
      documentType, 
      category, 
      entityId, 
      entityType,
      originalDocumentId,
      currentVersion, 
      salesStage 
    } = options;
    
    setIsUploading(true);
    
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${entityType}/${entityId}/${fileName}`;
      
      // Upload file to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (storageError) {
        throw storageError;
      }
      
      // Get the document table name 
      const tableName = getDocumentTableName(entityType);
      
      // Get the entity ID column name 
      const entityIdColumn = getEntityIdColumn(entityType);
      
      // Create document record
      let documentRecord: any = {
        document_name: documentName,
        document_type: documentType,
        file_path: filePath,
        entity_type: entityType,
        entity_id: entityId,
        [entityIdColumn]: entityId,
        uploaded_by: 'current-user-id', // This should be replaced with actual user ID
        category: category,
        company_id: 'current-company-id', // This should be replaced with actual company ID
        mime_type: file.type,
      };
      
      // Add version information if this is a new version of an existing document
      if (originalDocumentId && currentVersion) {
        // Handle version updates
        documentRecord.original_document_id = originalDocumentId;
        documentRecord.version = currentVersion + 1;
        
        // Set previous version as not latest
        await fromDocumentTable(tableName)
          .update({ is_latest_version: false })
          .eq('id', originalDocumentId);
      }
      
      // Add sales stage if provided
      if (salesStage && entityType === EntityType.SALES_PROCESS) {
        documentRecord.step = salesStage;
      }
      
      // Insert document record
      const { data: insertedData, error: documentError } = await fromDocumentTable(tableName)
        .insert(documentRecord)
        .select()
        .single();
      
      if (documentError) {
        throw documentError;
      }
      
      return insertedData;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadDocument,
    isUploading
  };
};
