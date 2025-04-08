
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
import { DocumentCategory } from "@/types/common";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import DocumentUploadForm from "@/components/documents/unified/DocumentUploadForm";

interface PolicyDocumentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
}

interface DocumentUploadActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

const DocumentUploadActions: React.FC<DocumentUploadActionsProps> = ({
  onClose,
  onSubmit,
  isSubmitting,
  isValid
}) => {
  const { t } = useLanguage();
  
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isSubmitting}
      >
        {t("cancel")}
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("uploading")}
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {t("upload")}
          </>
        )}
      </Button>
    </>
  );
};

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
    handleFileChange,
    isUploading,
    handleUpload
  } = useDocumentUpload({ 
    entityType,
    entityId,
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    originalDocumentId: originalDocumentId || undefined,
    currentVersion
  });

  const isValid = !!file && !!documentName && !!documentType;

  const handleSubmit = () => {
    if (isValid) {
      handleUpload();
    }
  };

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
          setDocumentCategory={(category) => setDocumentCategory(category)}
          file={file}
          handleFileChange={handleFileChange}
          isNewVersion={false}
        />

        <DialogFooter>
          <DocumentUploadActions
            onClose={onClose}
            onSubmit={handleSubmit}
            isSubmitting={isUploading}
            isValid={isValid}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyDocumentUploadDialog;
