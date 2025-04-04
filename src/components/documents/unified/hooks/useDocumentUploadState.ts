
import { useState } from "react";
import { DocumentCategory, EntityType } from "@/types/documents";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { DocumentService } from "@/services/DocumentService";

interface UseDocumentUploadStateProps {
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
  originalDocumentId?: string | null;
  currentVersion?: number;
}

export const useDocumentUploadState = (props: UseDocumentUploadStateProps) => {
  const { entityType, entityId, onSuccess, originalDocumentId, currentVersion } = props;
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    
    // Auto-fill name if not already set
    if (newFile && !documentName) {
      setDocumentName(newFile.name.split('.')[0]);
    }
  };
  
  const isValid = !!file && !!documentName && !!documentType;
  
  const handleSubmit = async (additionalData?: Record<string, any>) => {
    if (!isValid) {
      toast({
        title: t("missingRequiredFields"),
        description: t("pleaseCompleteAllRequiredFields"),
        variant: "destructive",
      });
      return;
    }
    
    if (!file) return;
    
    setUploading(true);
    
    try {
      const result = await DocumentService.uploadDocument({
        file,
        documentName,
        documentType,
        category: documentCategory || "other",
        entityId,
        entityType,
        originalDocumentId,
        currentVersion,
        additionalData
      });
      
      if (!result.success) {
        // Handle error as string regardless of its actual type
        throw new Error(typeof result.error === 'string' ? result.error : t("documentUploadFailed"));
      }
      
      toast({
        title: t("documentUploaded"),
        description: t("documentUploadedSuccessfully"),
      });
      
      // Clear form
      setDocumentName("");
      setDocumentType("");
      setDocumentCategory("");
      setFile(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: t("documentUploadFailed"),
        description: error.message || t("errorOccurredWhileUploading"),
        variant: "destructive",
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
    setFile,
    handleFileChange,
    uploading,
    isValid,
    handleSubmit
  };
};

export default useDocumentUploadState;
