
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import DocumentUploadTabs from "./DocumentUploadTabs";
import DocumentUploadForm from "./DocumentUploadForm";
import DocumentUploadActions from "./DocumentUploadActions";
import VersionInfoBox from "./VersionInfoBox";
import DocumentAnalysisPanel from "./DocumentAnalysisPanel";

interface EnhancedDocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  selectedDocument?: Document; // For version control
  onUploadComplete?: () => void; // Optional callback for when upload completes
}

const EnhancedDocumentUploadDialog: React.FC<EnhancedDocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  selectedDocument,
  onUploadComplete
}) => {
  const { t } = useLanguage();
  const [uploadMode, setUploadMode] = useState<"new" | "version">(selectedDocument ? "version" : "new");
  const [viewMode, setViewMode] = useState<"basic" | "ai">("basic");
  
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
        setDocumentCategory(selectedDocument.category as DocumentCategory);
      }
    }
  }, [isNewVersion, selectedDocument, setDocumentName, setDocumentType, setDocumentCategory]);

  const handleCategoryDetected = (category: DocumentCategory) => {
    setDocumentCategory(category);
  };

  const canUpload = !!file && !!documentName;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
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
        
        <Tabs value={viewMode} onValueChange={(value: "basic" | "ai") => setViewMode(value)} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">{t("basicUpload")}</TabsTrigger>
            <TabsTrigger value="ai">{t("aiAssisted")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="pt-4">
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
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
              </div>
              
              <DocumentAnalysisPanel
                file={file}
                onCategoryDetected={handleCategoryDetected}
                documentType={documentType}
                documentCategory={documentCategory}
              />
            </div>
          </TabsContent>
        </Tabs>
        
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

export default EnhancedDocumentUploadDialog;
