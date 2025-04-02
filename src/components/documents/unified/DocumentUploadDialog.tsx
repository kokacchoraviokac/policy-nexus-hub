
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import DocumentUploadForm from "./DocumentUploadForm";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  selectedDocument?: Document; // For version control
  onSuccess?: () => void;
  defaultCategory?: string;
  salesStage?: string;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  selectedDocument,
  onSuccess,
  defaultCategory,
  salesStage
}) => {
  const { t } = useLanguage();
  const [isNewVersion, setIsNewVersion] = useState<boolean>(!!selectedDocument);
  
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
    handleSubmit,
    isFormValid
  } = useDocumentManager({ 
    entityType,
    entityId
  });

  // Pre-fill form if uploading a new version
  useEffect(() => {
    if (isNewVersion && selectedDocument) {
      setDocumentName(selectedDocument.document_name);
      setDocumentType(selectedDocument.document_type);
      if (selectedDocument.category) {
        setDocumentCategory(selectedDocument.category);
      }
    }
  }, [isNewVersion, selectedDocument, setDocumentName, setDocumentType, setDocumentCategory]);

  // Set default category if provided
  useEffect(() => {
    if (defaultCategory && !documentCategory) {
      setDocumentCategory(defaultCategory as DocumentCategory);
    }
  }, [defaultCategory, documentCategory, setDocumentCategory]);

  const handleUploadClick = () => {
    const additionalData: Record<string, any> = {};
    
    // Add sales stage if this is a sales process document
    if (entityType === 'sales_process' && salesStage) {
      additionalData.step = salesStage;
    }
    
    // Add version information if this is a new version
    const versionInfo = isNewVersion && selectedDocument ? {
      originalDocumentId: selectedDocument.original_document_id || selectedDocument.id,
      currentVersion: selectedDocument.version || 1
    } : {};
    
    handleSubmit({
      ...additionalData,
      ...versionInfo
    });
    
    if (onSuccess) {
      onSuccess();
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!isUploading) {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isNewVersion ? t("uploadNewVersion") : t("uploadDocument")}
          </DialogTitle>
        </DialogHeader>
        
        {selectedDocument && (
          <div className="flex space-x-4 mb-2">
            <Button
              variant={isNewVersion ? "default" : "outline"}
              onClick={() => setIsNewVersion(true)}
              size="sm"
              className="flex-1"
            >
              {t("newVersion")}
            </Button>
            <Button
              variant={!isNewVersion ? "default" : "outline"}
              onClick={() => setIsNewVersion(false)}
              size="sm"
              className="flex-1"
            >
              {t("newDocument")}
            </Button>
          </div>
        )}
        
        <DocumentUploadForm
          documentName={documentName}
          setDocumentName={setDocumentName}
          documentType={documentType}
          setDocumentType={setDocumentType}
          documentCategory={documentCategory}
          setDocumentCategory={(category) => setDocumentCategory(category as DocumentCategory)}
          file={file}
          handleFileChange={handleFileChange}
          isNewVersion={isNewVersion}
          isSalesProcess={entityType === 'sales_process'}
          salesStage={salesStage}
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
            onClick={handleUploadClick}
            disabled={!isFormValid || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")}
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                {isNewVersion ? t("uploadNewVersion") : t("upload")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
