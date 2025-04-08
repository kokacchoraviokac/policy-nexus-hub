
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DocumentCategory, EntityType } from '@/types/common';
import { getDocumentTableName } from '@/utils/documentUploadUtils';

interface DocumentUploadOptions {
  entityType: EntityType;
  entityId: string;
  originalDocumentId?: string;
  currentVersion?: number;
  salesStage?: string;
  onSuccess?: () => void;
}

export const useDocumentUpload = (options: DocumentUploadOptions) => {
  const { user } = useAuth();
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | string>(DocumentCategory.OTHER);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    if (newFile && !documentName) {
      setDocumentName(newFile.name);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !documentName || !documentType || !user) {
      console.error('Missing required fields for document upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${options.entityType}/${options.entityId}/${uuidv4()}.${fileExt}`;
      
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (storageError) throw storageError;
      
      // 2. Determine version information
      let version = 1;
      let isLatestVersion = true;
      
      if (options.originalDocumentId && options.currentVersion) {
        version = options.currentVersion + 1;
        
        // Update previous version to not be the latest
        const tableName = getDocumentTableName(options.entityType);
        
        // For safety with TypeScript's typing of table names
        try {
          await supabase
            .from(tableName as any)
            .update({ is_latest_version: false })
            .eq('id', options.originalDocumentId);
        } catch (error) {
          console.error('Error updating previous version:', error);
          // Continue anyway as this is not a critical error
        }
      }
      
      // 3. Create document record in the database
      const documentRecord = {
        document_name: documentName,
        document_type: documentType,
        file_path: filePath,
        entity_type: options.entityType,
        entity_id: options.entityId,
        company_id: user.company_id,
        uploaded_by: user.id,
        uploaded_by_name: user.name,
        category: documentCategory,
        version,
        is_latest_version: isLatestVersion,
        original_document_id: options.originalDocumentId || null,
        mime_type: file.type,
        description: description || undefined
      };
      
      // Use appropriate table based on entity type
      const tableName = getDocumentTableName(options.entityType);
      
      // Add step field for sales documents
      if (options.entityType === EntityType.SALES_PROCESS && options.salesStage) {
        Object.assign(documentRecord, { step: options.salesStage });
      }
      
      // For safety with TypeScript's typing of table names
      const { error: dbError } = await supabase
        .from(tableName as any)
        .insert(documentRecord);
      
      if (dbError) throw dbError;
      
      console.log('Document uploaded successfully');
      
      if (options.onSuccess) {
        options.onSuccess();
      }
      
      // Reset form
      setDocumentName('');
      setDocumentType('');
      setDocumentCategory(DocumentCategory.OTHER);
      setDescription('');
      setFile(null);
      
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    documentName,
    setDocumentName,
    documentType,
    setDocumentType,
    documentCategory,
    setDocumentCategory,
    description,
    setDescription,
    file,
    handleFileChange,
    handleUpload,
    isUploading
  };
};
