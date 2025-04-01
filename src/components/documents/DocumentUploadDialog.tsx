
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import DocumentUploadTabs from "./DocumentUploadTabs";
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
  embedMode?: boolean; // Flag to indicate if component is embedded in another dialog
  onFileSelected?: (file: File | null) => void; // Callback to notify parent when file is selected
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  selectedDocument,
  onUploadComplete,
  embedMode = false,
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
    uploading,
    handleUpload
  } = useDocumentUpload({ 
    entityType,
    entityId,
    onSuccess: () => {
      if (!embedMode) {
        onOpenChange(false);
      }
      if (onUploadComplete) {
        onUploadComplete();
      }
    },
    originalDocumentId: isNewVersion ? (selectedDocument?.original_document_id || selectedDocument?.id) : undefined,
    currentVersion: isNewVersion ? (selectedDocument?.version || 1) : 0
  });
  
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

  // Notify parent component when file changes
  useEffect(() => {
    if (onFileSelected) {
      onFileSelected(file);
    }
  }, [file, onFileSelected]);

  const canUpload = !!file && !!documentName;
  
  // In embed mode, don't render the Dialog wrapper
  if (embedMode) {
    return (
      <div className="space-y-4">
        <DocumentUploadTabs 
          uploadMode={uploadMode}
          setUploadMode={setUploadMode}
          showTabs={!!selectedDocument}
        />
        
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
        />
        
        <VersionInfoBox 
          isNewVersion={isNewVersion}
          selectedDocument={selectedDocument}
        />
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <DocumentUploadActions
            uploading={uploading}
            isNewVersion={isNewVersion}
            canUpload={canUpload}
            onCancel={() => onOpenChange(false)}
            onUpload={handleUpload}
          />
        </div>
      </div>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isNewVersion ? t("uploadNewVersion") : t("uploadDocument")}
          </DialogTitle>
        </DialogHeader>
        
        <DocumentUploadTabs 
          uploadMode={uploadMode}
          setUploadMode={setUploadMode}
          showTabs={!!selectedDocument}
        />
        
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
        />
        
        <VersionInfoBox 
          isNewVersion={isNewVersion}
          selectedDocument={selectedDocument}
        />
        
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
