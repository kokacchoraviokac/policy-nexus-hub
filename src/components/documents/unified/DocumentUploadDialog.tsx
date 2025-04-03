
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import DocumentUploadForm from "./DocumentUploadForm";
import DocumentUploadActions from "./DocumentUploadActions";
import VersionInfoBox from "./VersionInfoBox";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  selectedDocument?: Document; // For version control
  onUploadComplete?: () => void; // Optional callback for when upload completes
  defaultCategory?: string; // Default category for the document
  salesStage?: string; // Sales process stage
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  selectedDocument,
  onUploadComplete,
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
    uploading,
    handleUpload,
    setSalesStage
  } = useDocumentUpload({ 
    entityType,
    entityId,
    onSuccess: () => {
      onOpenChange(false);
      if (onUploadComplete) {
        onUploadComplete();
      }
    },
    originalDocumentId: isNewVersion ? (selectedDocument?.original_document_id || selectedDocument?.id) : undefined,
    currentVersion: isNewVersion ? (selectedDocument?.version || 1) : 0
  });
  
  // Set default category if provided
  useEffect(() => {
    if (defaultCategory && documentCategory === "") {
      setDocumentCategory(defaultCategory as DocumentCategory);
    }
  }, [defaultCategory, documentCategory, setDocumentCategory]);

  // Set sales stage if provided
  useEffect(() => {
    if (salesStage && setSalesStage) {
      setSalesStage(salesStage);
    }
  }, [salesStage, setSalesStage]);
  
  // Pre-fill form if uploading a new version
  useEffect(() => {
    if (isNewVersion && selectedDocument) {
      setDocumentName(selectedDocument.document_name);
      setDocumentType(selectedDocument.document_type);
      if (selectedDocument.category) {
        // Force type as DocumentCategory to avoid type error
        setDocumentCategory(selectedDocument.category as DocumentCategory);
      }
    }
  }, [isNewVersion, selectedDocument, setDocumentName, setDocumentType, setDocumentCategory]);

  const canUpload = !!file && !!documentName;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isNewVersion ? t("uploadNewVersion") : t("uploadDocument")}
          </DialogTitle>
        </DialogHeader>
        
        <DocumentUploadForm
          documentName={documentName}
          setDocumentName={setDocumentName}
          documentType={documentType}
          setDocumentType={setDocumentType}
          documentCategory={documentCategory}
          // Cast the setter to match the expected type
          setDocumentCategory={(category) => setDocumentCategory(category as DocumentCategory)}
          file={file}
          handleFileChange={handleFileChange}
          isNewVersion={isNewVersion}
          isSalesProcess={entityType === "sales_process"}
          salesStage={salesStage}
        />
        
        {isNewVersion && selectedDocument && (
          <VersionInfoBox 
            selectedDocument={selectedDocument}
          />
        )}
        
        <DialogFooter>
          <DocumentUploadActions
            uploading={uploading}
            isNewVersion={isNewVersion}
            canUpload={canUpload}
            onCancel={() => onOpenChange(false)}
            onUpload={handleUpload}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
