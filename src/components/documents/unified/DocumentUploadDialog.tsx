
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, DocumentUploadDialogProps, EntityType } from "@/types/documents";
import { DocumentCategory } from "@/types/common";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import DocumentUploadForm from "./DocumentUploadForm";
import { Button } from "@/components/ui/button";
import { Loader2, FileUp } from "lucide-react";

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  onUploadComplete,
  defaultCategory,
  salesStage,
  selectedDocument,
  embedMode,
  onFileSelected
}) => {
  const { t } = useLanguage();
  const [uploadMode, setUploadMode] = useState<"new" | "version">(selectedDocument ? "version" : "new");
  
  const isNewVersion = uploadMode === "version" && !!selectedDocument;
  
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
    handleUpload,
    setSalesStage
  } = useDocumentUpload({
    entityId,
    entityType,
    onSuccess: () => {
      if (onUploadComplete) onUploadComplete();
      onOpenChange(false);
    },
    originalDocumentId: isNewVersion ? (selectedDocument?.original_document_id || selectedDocument?.id) : undefined,
    currentVersion: isNewVersion ? (selectedDocument?.version || 1) : undefined,
    salesStage
  });

  // Set default category if provided
  useEffect(() => {
    if (defaultCategory && documentCategory === "") {
      setDocumentCategory(defaultCategory as DocumentCategory);
    }
  }, [defaultCategory, documentCategory, setDocumentCategory]);

  useEffect(() => {
    if (onFileSelected) {
      onFileSelected(file);
    }
  }, [file, onFileSelected]);

  const isValid = !!file && !!documentName;

  const handleSubmit = () => {
    if (isValid) {
      handleUpload();
    }
  };

  if (embedMode) {
    return (
      <div className="space-y-4">
        <DocumentUploadForm
          documentName={documentName}
          setDocumentName={setDocumentName}
          documentType={documentType}
          setDocumentType={setDocumentType}
          documentCategory={documentCategory}
          setDocumentCategory={setDocumentCategory as any}
          file={file}
          handleFileChange={handleFileChange}
          isNewVersion={isNewVersion}
        />

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            {t("cancel")}
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={!isValid || isUploading}
          >
            {isUploading ? (
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
      </div>
    );
  }

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
          setDocumentCategory={setDocumentCategory as any}
          file={file}
          handleFileChange={handleFileChange}
          isNewVersion={!!selectedDocument}
        />

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            {t("cancel")}
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={!isValid || isUploading}
          >
            {isUploading ? (
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
