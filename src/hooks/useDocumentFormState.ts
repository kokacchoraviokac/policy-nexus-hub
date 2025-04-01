
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadDocument } from "@/utils/documents";
import { useActivityLogger } from "@/utils/activityLogger";
import { EntityType } from "@/types/documents";

interface UseDocumentFormStateProps {
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
  onSuccess: () => void;
}

export const useDocumentFormState = ({
  entityId,
  entityType,
  originalDocumentId,
  currentVersion,
  onSuccess
}: UseDocumentFormStateProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logActivity } = useActivityLogger();

  const isValid = !!file && !!documentName;

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: t("noFileSelected"),
        description: t("pleaseSelectFileToUpload"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await uploadDocument({
        file,
        documentName,
        documentType,
        category: documentCategory,
        entityId,
        entityType,
        originalDocumentId,
        currentVersion
      });

      if (result.success) {
        // Log activity
        await logActivity({
          entity_type: entityType,
          entity_id: entityId,
          action: "create",
          details: {
            document_name: documentName,
            document_type: documentType,
            timestamp: new Date().toISOString()
          }
        });

        onSuccess();
        
        toast({
          title: t("documentUploaded"),
          description: t("documentUploadedSuccessfully"),
        });
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: t("errorUploadingDocument"),
        description: t("errorOccurredWhileUploading"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
    isSubmitting,
    isValid,
    handleSubmit
  };
};
