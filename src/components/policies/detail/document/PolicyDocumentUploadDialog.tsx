
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
import { EntityType } from "@/types/documents";
import { useDocumentUploadState } from "@/components/documents/unified/hooks/useDocumentUploadState";
import DocumentUploadForm from "@/components/documents/unified/DocumentUploadForm";
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
    uploading: isSubmitting,
    isValid,
    handleSubmit
  } = useDocumentUploadState({
    entityId,
    entityType,
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
