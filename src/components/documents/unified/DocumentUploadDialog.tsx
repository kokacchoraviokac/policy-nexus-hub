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
import { EntityType, DocumentCategory } from "@/types/documents";
import { useDocumentUploadState } from "./hooks/useDocumentUploadState";
import DocumentUploadForm from "./DocumentUploadForm";
import { Button } from "@/components/ui/button";
import { Loader2, FileUp } from "lucide-react";

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onUploadComplete?: () => void;
  defaultCategory?: string;
  salesStage?: string;
  selectedDocument?: any;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  onUploadComplete,
  defaultCategory,
  salesStage,
  selectedDocument
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
    uploading: isSubmitting,
    isValid,
    handleSubmit
  } = useDocumentUploadState({
    entityId,
    entityType,
    defaultCategory: defaultCategory as DocumentCategory,
    selectedDocument,
    onSuccess: () => {
      if (onUploadComplete) onUploadComplete();
      onOpenChange(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedDocument 
              ? t("uploadNewVersion") 
              : t("uploadDocument")}
          </DialogTitle>
          <DialogDescription>
            {selectedDocument 
              ? t("uploadNewVersionDescription") 
              : t("uploadDocumentDescription")}
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
          handleFileChange={handleFileChange}
          isNewVersion={!!selectedDocument}
        />

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")}
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                {t("upload")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
