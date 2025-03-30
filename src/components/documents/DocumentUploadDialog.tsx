
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { Document } from "@/types/documents";
import DocumentUploadTabs from "./DocumentUploadTabs";
import DocumentUploadForm from "./DocumentUploadForm";
import DocumentUploadActions from "./DocumentUploadActions";
import VersionInfoBox from "./VersionInfoBox";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: "policy" | "claim" | "client" | "insurer" | "sales_process" | "agent";
  entityId: string;
  selectedDocument?: Document; // For version control
  onUploadComplete?: () => void; // Optional callback for when upload completes
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  selectedDocument,
  onUploadComplete
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
      onOpenChange(false);
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
        setDocumentCategory(selectedDocument.category);
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
          setDocumentCategory={setDocumentCategory}
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
