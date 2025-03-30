
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFileInput, validateUploadFields } from "@/utils/fileHandlingUtils";
import { getDocumentTable, uploadFileToStorage, insertDocumentRecord, createDocumentData } from "@/utils/documentUploadUtils";
import type { EntityType } from "@/utils/activityLogger";
import type { DocumentCategory } from "@/types/documents";

export interface UseDocumentUploadProps {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  originalDocumentId?: string; // For version control
  currentVersion?: number; // For version control
}

export const useDocumentUpload = ({
  entityType,
  entityId,
  onSuccess,
  originalDocumentId,
  currentVersion = 0
}: UseDocumentUploadProps) => {
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | "">("");
  const [uploading, setUploading] = useState(false);
  
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  const { 
    file, 
    setFile, 
    documentName, 
    setDocumentName, 
    handleFileChange 
  } = useFileInput();
  
  // Get appropriate document table name
  const documentTable = getDocumentTable(entityType);
  
  const uploadMutation = useMutation({
    mutationFn: async () => {
      // Validate required fields
      const validation = validateUploadFields(file, documentName, documentType);
      if (!validation.isValid) {
        throw new Error(`Missing required field: ${validation.missingField}`);
      }
      
      setUploading(true);
      try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (!userId) {
          throw new Error("User not authenticated");
        }
        
        const userName = user.data.user?.email || user.data.user?.user_metadata?.name || userId;
        
        // Upload file to storage
        const { documentId, filePath } = await uploadFileToStorage(file!, entityType, entityId);
        
        // Define version information
        const isNewVersion = !!originalDocumentId;
        const version = isNewVersion ? currentVersion + 1 : 1;
        
        // Define base document data - only include fields that actually exist in the table
        const baseData = {
          id: documentId,
          document_name: documentName,
          document_type: documentType,
          file_path: filePath,
          uploaded_by: userId,
          company_id: user.data.user?.user_metadata?.company_id
        };
        
        // Create entity-specific document data
        const insertData = createDocumentData(baseData, entityType, entityId);
        
        // Insert document record
        await insertDocumentRecord(documentTable, insertData);
        
        // Log activity
        await logActivity({
          entityType,
          entityId,
          action: "update",
          details: {
            action_type: isNewVersion ? "document_version_uploaded" : "document_uploaded",
            document_id: documentId,
            document_name: documentName,
            document_type: documentType,
            version: version,
            original_document_id: originalDocumentId
          }
        });
        
        return { documentId, documentName, version };
      } finally {
        setUploading(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents", entityType, entityId] });
      queryClient.invalidateQueries({ queryKey: ["policy-documents", entityId] });
      
      if (originalDocumentId) {
        queryClient.invalidateQueries({ queryKey: ["document-versions", originalDocumentId] });
      }
      
      toast({
        title: originalDocumentId ? t("documentVersionUploaded") : t("documentUploaded"),
        description: originalDocumentId 
          ? t("documentVersionUploadedSuccess", { name: data.documentName, version: data.version }) 
          : t("documentUploadedSuccess", { name: data.documentName }),
      });
      
      // Reset form
      setDocumentName("");
      setDocumentType("");
      setDocumentCategory("");
      setFile(null);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error in upload mutation:", error);
      toast({
        title: t("documentUploadError"),
        description: t("documentUploadErrorMessage"),
        variant: "destructive",
      });
    }
  });
  
  const handleUpload = () => {
    // Validate client-side before mutation
    const validation = validateUploadFields(file, documentName, documentType);
    
    if (!validation.isValid) {
      let errorTitle = "";
      let errorDescription = "";
      
      switch (validation.missingField) {
        case "file":
          errorTitle = t("noFileSelected");
          errorDescription = t("pleaseSelectFile");
          break;
        case "documentName":
          errorTitle = t("noDocumentName");
          errorDescription = t("pleaseEnterDocumentName");
          break;
        case "documentType":
          errorTitle = t("noDocumentType");
          errorDescription = t("pleaseSelectDocumentType");
          break;
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
      return;
    }
    
    uploadMutation.mutate();
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
    isNewVersion: !!originalDocumentId,
    currentVersion
  };
};
