
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseDocumentUploadStateProps {
  entityId: string;
  entityType: string;
  onSuccess?: () => void;
}

export const useDocumentUploadState = ({
  entityId,
  entityType,
  onSuccess
}: UseDocumentUploadStateProps) => {
  const { t } = useLanguage();
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const resetForm = () => {
    setDocumentName("");
    setDocumentType("");
    setDocumentCategory("");
    setFile(null);
  };
  
  const isValid = !!documentName && !!documentType && !!file;
  
  const handleSubmit = async () => {
    if (!isValid) {
      toast.warning(t("missingRequiredFields"));
      return;
    }
    
    setUploading(true);
    
    try {
      // In a real implementation, this would call an API to upload the document
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      console.log("Uploading document:", {
        name: documentName,
        type: documentType,
        category: documentCategory,
        file: file.name,
        entityId,
        entityType
      });
      
      toast.success(t("documentUploadedSuccessfully"));
      resetForm();
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(t("documentUploadFailed"));
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
    uploading,
    isValid,
    handleSubmit,
    resetForm
  };
};
