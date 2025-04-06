
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityType, DocumentCategory } from "@/types/documents";
import { getDocumentTableName, asTableName } from "@/utils/documentUploadUtils";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface BatchDocumentFile {
  file: File;
  documentName: string;
  documentType: string;
  category: DocumentCategory | string;
}

interface UseBatchDocumentUploadProps {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  onProgress?: (filename: string, progress: number) => void;
  onFileSuccess?: (filename: string) => void;
  onFileError?: (filename: string, error: string) => void;
}

export const useBatchDocumentUpload = ({
  entityType,
  entityId,
  onSuccess,
  onProgress,
  onFileSuccess,
  onFileError
}: UseBatchDocumentUploadProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: BatchDocumentFile[]) => {
      const results = [];
      
      // Get current user
      if (!user) throw new Error("User not authenticated");
      
      for (const fileInfo of files) {
        try {
          // Update progress
          if (onProgress) {
            onProgress(fileInfo.file.name, 10);
          }
          
          // Generate file path
          const fileExt = fileInfo.file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `documents/${entityType}/${entityId}/${fileName}`;
          
          // 1. Upload file to storage
          if (onProgress) {
            onProgress(fileInfo.file.name, 30);
          }
          
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, fileInfo.file);
            
          if (uploadError) throw uploadError;
          
          if (onProgress) {
            onProgress(fileInfo.file.name, 60);
          }
          
          // 2. Create document record
          const tableName = getDocumentTableName(entityType);
          
          // Prepare document data based on entity type
          let documentData: any = {
            document_name: fileInfo.documentName,
            document_type: fileInfo.documentType,
            file_path: filePath,
            uploaded_by: user.id,
            company_id: user?.company_id || user?.companyId,
            category: fileInfo.category,
            version: 1,
            is_latest_version: true,
            mime_type: fileInfo.file.type
          };
          
          // Add entity-specific ID field
          if (entityType === "policy") {
            documentData.policy_id = entityId;
          } else if (entityType === "claim") {
            documentData.claim_id = entityId;
          } else if (entityType === "sales_process") {
            documentData.sales_process_id = entityId;
          } else if (entityType === "client") {
            documentData.client_id = entityId;
          } else if (entityType === "insurer") {
            documentData.insurer_id = entityId;
          } else if (entityType === "agent") {
            documentData.agent_id = entityId;
          }
          
          if (onProgress) {
            onProgress(fileInfo.file.name, 80);
          }
          
          const { data, error: dbError } = await supabase
            .from(asTableName(tableName))
            .insert(documentData)
            .select()
            .single();
            
          if (dbError) {
            // Try to clean up the uploaded file on db error
            await supabase.storage
              .from('documents')
              .remove([filePath]);
              
            throw dbError;
          }
          
          if (onProgress) {
            onProgress(fileInfo.file.name, 100);
          }
          
          if (onFileSuccess) {
            onFileSuccess(fileInfo.file.name);
          }
          
          results.push({ success: true, data, file: fileInfo.file.name });
        } catch (error: any) {
          console.error(`Error uploading file ${fileInfo.file.name}:`, error);
          
          if (onFileError) {
            onFileError(fileInfo.file.name, error.message || "Upload failed");
          }
          
          results.push({ 
            success: false, 
            file: fileInfo.file.name, 
            error: error.message || "Upload failed" 
          });
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ['documents', entityType, entityId] 
      });
      
      // Count successful and failed uploads
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;
      
      // Show toast with summary
      if (successCount > 0) {
        toast.success(
          t("documentsUploadedSuccessfully", {
            count: successCount
          })
        );
      }
      
      if (failureCount > 0) {
        toast.error(
          t("someDocumentsFailedToUpload", {
            count: failureCount
          })
        );
      }
      
      if (onSuccess && successCount > 0) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      console.error("Batch upload error:", error);
      toast.error(error.message || t("documentBatchUploadFailed"));
    }
  });

  return {
    uploadBatch: uploadMutation.mutate,
    isBatchUploading: uploadMutation.isPending,
    uploadProgress,
    reset: () => setUploadProgress({})
  };
};
