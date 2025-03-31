
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/auth/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { DocumentCategory } from "@/types/documents";

interface UseDocumentUploadProps {
  entityType: "policy" | "claim" | "sales_process" | "client" | "insurer" | "agent";
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
}: UseDocumentUploadProps) => {
  const { user } = useAuthContext();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Map entity type to the table name
  const getTableName = () => {
    switch (entityType) {
      case 'policy':
        return 'policy_documents';
      case 'claim':
        return 'claim_documents';
      case 'sales_process':
        return 'sales_documents';
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  };
  
  // Map entity type to the entity ID column name
  const getEntityIdColumn = () => {
    switch (entityType) {
      case 'policy':
        return 'policy_id';
      case 'claim':
        return 'claim_id';
      case 'sales_process':
        return 'sales_process_id';
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  };
  
  const tableName = getTableName();
  const entityIdColumn = getEntityIdColumn();
  
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    
    if (newFile && !documentName) {
      // Auto-populate document name from file name if not set
      const fileName = newFile.name.split('.').slice(0, -1).join('.');
      setDocumentName(fileName);
    }
  };
  
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !documentName || !documentType) {
        throw new Error("Missing required fields");
      }
      
      setUploading(true);
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      const companyId = user.companyId;
      if (!companyId) {
        throw new Error("Company ID not found");
      }

      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${entityType}/${entityId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // 1. Upload file to Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // 2. Prepare document record
      const newVersion = currentVersion + 1;
      const isNewVersion = !!originalDocumentId;
      
      // If this is a new version, we need to update existing versions first
      if (isNewVersion) {
        // Mark all existing versions as not latest
        const { error: updateError } = await supabase
          .from(tableName)
          .update({ is_latest_version: false })
          .eq('original_document_id', originalDocumentId);
        
        if (updateError) throw updateError;
      }
      
      // 3. Insert document record
      const documentData = {
        [entityIdColumn]: entityId,
        document_name: documentName,
        document_type: documentType,
        document_category: documentCategory || null,
        file_path: filePath,
        uploaded_by: user.id,
        company_id: companyId,
        version: newVersion,
        is_latest_version: true,
        original_document_id: isNewVersion ? originalDocumentId : null,
        mime_type: file.type
      };
      
      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert([documentData])
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      return { data, isNewVersion, version: newVersion };
    },
    onSuccess: (result) => {
      const successMessage = result.isNewVersion
        ? t("documentVersionUploadedSuccess", { name: documentName, version: result.version })
        : t("documentUploadedSuccess", { name: documentName });
      
      toast({
        title: result.isNewVersion ? t("documentVersionUploaded") : t("documentUploaded"),
        description: successMessage
      });
      
      // Reset form
      setDocumentName("");
      setDocumentType("");
      setDocumentCategory("");
      setFile(null);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [`${entityType}-documents`, entityId]
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Document upload error:", error);
      toast({
        title: t("documentUploadError"),
        description: t("documentUploadErrorMessage"),
        variant: "destructive"
      });
    },
    onSettled: () => {
      setUploading(false);
    }
  });
  
  const handleUpload = () => {
    // Validate input
    if (!documentName) {
      toast({
        title: t("noDocumentName"),
        description: t("pleaseEnterDocumentName"),
        variant: "destructive"
      });
      return;
    }
    
    if (!documentType) {
      toast({
        title: t("noDocumentType"),
        description: t("pleaseSelectDocumentType"),
        variant: "destructive"
      });
      return;
    }
    
    if (!file) {
      toast({
        title: t("noFileSelected"),
        description: t("pleaseSelectFile"),
        variant: "destructive"
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
    handleUpload
  };
};
