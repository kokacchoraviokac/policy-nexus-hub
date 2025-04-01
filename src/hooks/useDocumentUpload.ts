
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DocumentUploadRequest, DocumentCategory, EntityType } from "@/types/documents";
import { getDocumentTableName, DocumentTableName } from "@/utils/documentUploadUtils"; 
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

interface UseDocumentUploadParams {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  originalDocumentId?: string;
  currentVersion?: number;
}

export const useDocumentUpload = ({ 
  entityType,
  entityId,
  onSuccess,
  originalDocumentId,
  currentVersion = 0
}: UseDocumentUploadParams) => {
  const queryClient = useQueryClient();
  const [documentName, setDocumentName] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
  };
  
  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      
      setUploading(true);
      
      try {
        // 1. Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        
        // 2. Upload file to storage
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
        
        // 3. Determine correct table name
        const tableName = getDocumentTableName(entityType);
        
        // 4. Calculate new version if it's a version update
        const version = currentVersion > 0 ? currentVersion + 1 : 1;
        
        // 5. Create document record in database - use type assertion to fix the overload issue
        const documentData = {
          document_name: documentName,
          document_type: documentType,
          file_path: filePath,
          entity_id: entityId,
          uploaded_by: user.id,
          company_id: user?.user_metadata?.company_id,
          description: "",
          category: documentCategory === "" ? null : documentCategory,
          version: version,
          is_latest_version: true,
          mime_type: file.type,
          original_document_id: originalDocumentId || null
        };
        
        // Insert the document using type assertion to fix the overload issue
        const { data, error: dbError } = await supabase
          .from(tableName as any)
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
        
        // 6. If this is a new version, update previous version
        if (originalDocumentId) {
          await supabase
            .from(tableName as any)
            .update({ is_latest_version: false })
            .eq('id', originalDocumentId);
        }
        
        return { success: true, filePath, data };
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', entityType, entityId]
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setDocumentName("");
      setDocumentType("");
      setDocumentCategory("");
      setFile(null);
    }
  });
  
  const handleUpload = () => {
    upload.mutate();
  };
  
  return {
    documentName,
    setDocumentName,
    documentType,
    setDocumentType,
    documentCategory,
    setDocumentCategory,
    file,
    handleFileChange,
    uploading,
    handleUpload,
    isSuccess: upload.isSuccess,
    isError: upload.isError,
    error: upload.error
  };
};

export default useDocumentUpload;
