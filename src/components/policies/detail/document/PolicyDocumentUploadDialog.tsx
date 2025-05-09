
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocumentFormState } from "@/hooks/useDocumentFormState";
import { EntityType } from "@/types/documents";
import DocumentUploadForm from "./DocumentUploadForm";
import DocumentUploadActions from "./DocumentUploadActions";

interface PolicyDocumentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
}

const PolicyDocumentUploadDialog: React.FC<PolicyDocumentUploadDialogProps> = ({
  open,
  onClose,
  onSuccess,
  entityId,
  entityType,
  originalDocumentId,
  currentVersion
}) => {
  const { t } = useLanguage();
  
  const {
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
  } = useDocumentFormState({
    entityId,
    entityType,
    originalDocumentId,
    currentVersion,
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("uploadDocument")}</DialogTitle>
          <DialogDescription>
            {t("uploadNewDocumentToPolicy")}
          </DialogDescription>
        </DialogHeader>

        <DocumentUploadForm
          documentName={documentName}
          setDocumentName={setDocumentName}
          documentType={documentType}
          setDocumentType={setDocumentType}
          documentCategory={documentCategory}
          setDocumentCategory={setDocumentCategory}
          file={file}
          setFile={setFile}
        />

        <DialogFooter>
          <DocumentUploadActions
            onClose={onClose}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isValid={isValid}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyDocumentUploadDialog;
