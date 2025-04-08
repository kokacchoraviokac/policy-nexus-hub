
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { DocumentUploadRequest, EntityType, DocumentCategory } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { v4 as uuidv4 } from "uuid";

interface UseDocumentUploadParams {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  originalDocumentId?: string; // For versioning
  currentVersion?: number; // For versioning
}

export function useDocumentUpload({
  entityType,
  entityId,
  onSuccess,
  onError,
  originalDocumentId,
  currentVersion = 0,
}: UseDocumentUploadParams) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [documentName, setDocumentName] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [salesStage, setSalesStage] = useState<string | null>(null);
  
  const tableName = getDocumentTableName(entityType);
  
  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      // If document name is empty, use the file name (without extension)
      if (!documentName) {
        const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
        setDocumentName(fileName);
      }
    } else {
      setFile(null);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !documentName || !documentType) {
      toast({
        title: t("validationError"),
        description: t("pleaseCompleteAllRequiredFields"),
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${entityType}/${entityId}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Create document record
      const newVersion = currentVersion > 0 ? currentVersion + 1 : 1;
      
      // Map entity ID field based on entity type
      const entityIdField = getEntityIdField(entityType);
      
      const documentData: any = {
        document_name: documentName,
        document_type: documentType,
        category: documentCategory || null,
        description: description || null,
        file_path: filePath,
        entity_type: entityType,
        [entityIdField]: entityId,
        uploaded_by: user?.id,
        company_id: user?.company_id,
        version: newVersion,
        is_latest_version: true,
        mime_type: file.type,
        original_document_id: originalDocumentId || null,
      };
      
      // Add sales stage if present and entity type is a sales process
      if (salesStage && (entityType === EntityType.SALES_PROCESS || entityType === EntityType.SALE)) {
        documentData.step = salesStage;
      }
      
      // If this is a new version, update previous version
      if (originalDocumentId) {
        const { error: updateError } = await supabase
          .from(tableName)
          .update({ is_latest_version: false })
          .eq('id', originalDocumentId);
        
        if (updateError) throw updateError;
      }
      
      // Create the document record
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(documentData);
      
      if (insertError) throw insertError;
      
      toast({
        title: t("uploadSuccess"),
        description: t("documentUploadedSuccessfully"),
      });
      
      // Reset form
      setDocumentName("");
      setDocumentType("");
      setDocumentCategory("");
      setFile(null);
      setDescription("");
      setIsUploading(false);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error uploading document:", error);
      setIsUploading(false);
      
      const errorMessage = error instanceof Error ? error.message : t("unknownError");
      
      toast({
        title: t("uploadError"),
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError && error instanceof Error) onError(error);
    }
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
    isUploading,
    handleUpload,
    description,
    setDescription,
    salesStage,
    setSalesStage,
  };
}

// Helper function to determine the entity ID field name
function getEntityIdField(entityType: EntityType): string {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_id';
    case EntityType.CLAIM:
      return 'claim_id';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'sales_process_id';
    case EntityType.CLIENT:
      return 'client_id';
    case EntityType.INSURER:
      return 'insurer_id';
    case EntityType.AGENT:
      return 'agent_id';
    case EntityType.INVOICE:
      return 'invoice_id';
    case EntityType.POLICY_ADDENDUM:
    case EntityType.ADDENDUM:
      return 'addendum_id';
    default:
      return 'entity_id';
  }
}
