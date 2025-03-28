
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";
import { EntityType } from "./useDocuments";

export interface UseDocumentUploadProps {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
}

export const useDocumentUpload = ({
  entityType,
  entityId,
  onSuccess
}: UseDocumentUploadProps) => {
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  const handleFileChange = (file: File | null) => {
    if (file) {
      setFile(file);
      // If no document name is set yet, use the file name
      if (!documentName) {
        setDocumentName(file.name.split('.')[0]);
      }
    }
  };
  
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !documentName || !documentType) {
        throw new Error("Missing required fields");
      }
      
      setUploading(true);
      try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        const userName = user.data.user?.email || user.data.user?.user_metadata?.name || userId;
        
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
        
        // Create document record in database
        const { error: insertError } = await supabase
          .from('documents')
          .insert({
            id: documentId,
            document_name: documentName,
            document_type: documentType,
            entity_type: entityType,
            entity_id: entityId,
            file_path: filePath,
            uploaded_by_id: userId,
            uploaded_by_name: userName,
            version: 1,
            is_latest_version: true,
            mime_type: file.type,
            file_size: file.size
          });
          
        if (insertError) {
          // If record creation fails, delete uploaded file
          await supabase.storage
            .from('documents')
            .remove([filePath]);
          throw insertError;
        }
        
        // Log activity
        await logActivity({
          entityType,
          entityId,
          action: "document_uploaded",
          details: {
            document_id: documentId,
            document_name: documentName,
            document_type: documentType
          }
        });
        
        return { documentId, documentName };
      } finally {
        setUploading(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents", entityType, entityId] });
      
      toast({
        title: t("documentUploaded"),
        description: t("documentUploadedSuccess", { name: data.documentName }),
      });
      
      // Reset form
      setDocumentName("");
      setDocumentType("");
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
    if (!file) {
      toast({
        title: t("noFileSelected"),
        description: t("pleaseSelectFile"),
        variant: "destructive",
      });
      return;
    }
    
    if (!documentName) {
      toast({
        title: t("noDocumentName"),
        description: t("pleaseEnterDocumentName"),
        variant: "destructive",
      });
      return;
    }
    
    if (!documentType) {
      toast({
        title: t("noDocumentType"),
        description: t("pleaseSelectDocumentType"),
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
    file,
    handleFileChange,
    uploading,
    handleUpload
  };
};
