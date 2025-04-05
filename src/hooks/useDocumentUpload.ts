
import { useState } from "react";
import { DocumentCategory, EntityType } from "@/types/documents";
import { uploadDocument } from "@/utils/documents";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseDocumentUploadProps {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  originalDocumentId?: string;
  currentVersion?: number;
}

export function useDocumentUpload({
  entityType,
  entityId,
  onSuccess,
  originalDocumentId,
  currentVersion = 0
}: UseDocumentUploadProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [documentName, setDocumentName] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [salesStage, setSalesStage] = useState<string>("");
  
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    
    // Automatically set document name from file name if not set yet
    if (newFile && !documentName) {
      const fileName = newFile.name.split('.')[0];
      setDocumentName(fileName);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !documentName || !documentType) {
      toast({
        title: t("missingRequiredFields"),
        description: t("pleaseCompleteAllRequiredFields"),
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const result = await uploadDocument({
        file,
        documentName,
        documentType,
        category: documentCategory || "other",
        entityId,
        entityType,
        originalDocumentId,
        currentVersion,
        salesStage: entityType === "sales_process" ? salesStage : undefined
      });
      
      if (!result.success) {
        throw new Error(result.error || t("documentUploadFailed"));
      }
      
      toast({
        title: t("documentUploaded"),
        description: t("documentUploadedSuccessfully")
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setDocumentName("");
      setDocumentType("");
      setDocumentCategory("");
      setFile(null);
    } catch (error: any) {
      console.error("Document upload error:", error);
      toast({
        title: t("documentUploadFailed"),
        description: error.message || t("errorOccurredWhileUploading"),
        variant: "destructive"
      });
    } finally {
      setUploading(false);
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
    uploading,
    handleUpload,
    salesStage,
    setSalesStage
  };
}
