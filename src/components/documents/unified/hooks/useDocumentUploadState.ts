
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentCategory, EntityType } from "@/types/common";
import { Document } from "@/types/documents";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseDocumentUploadStateProps {
  entityType: EntityType;
  entityId: string;
  defaultCategory?: DocumentCategory;
  selectedDocument?: Document;
  onSuccess?: () => void;
}

export const useDocumentUploadState = ({
  entityType,
  entityId,
  defaultCategory,
  selectedDocument,
  onSuccess
}: UseDocumentUploadStateProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documentName, setDocumentName] = useState(selectedDocument?.document_name || "");
  const [documentType, setDocumentType] = useState(selectedDocument?.document_type || "");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory | string>(
    selectedDocument?.category || defaultCategory || ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [salesStage, setSalesStage] = useState<string | undefined>(undefined);
  
  const { uploadDocument, isUploading } = useUploadDocument();
  
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
  };
  
  const isValid = !!file && !!documentName && !!documentType;
  
  const handleSubmit = async () => {
    if (!file || !documentName || !documentType) {
      toast({
        title: t("validationError"),
        description: t("pleaseCompleteAllRequiredFields"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      await uploadDocument({
        file,
        documentName,
        documentType,
        category: documentCategory,
        entityId,
        entityType,
        originalDocumentId: selectedDocument?.id,
        currentVersion: selectedDocument?.version,
        salesStage
      });
      
      toast({
        title: t("documentUploaded"),
        description: t("documentUploadedSuccessfully")
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: t("uploadError"),
        description: error.message || t("errorUploadingDocument"),
        variant: "destructive"
      });
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
    uploading: isUploading,
    isValid,
    handleSubmit,
    salesStage,
    setSalesStage
  };
};
