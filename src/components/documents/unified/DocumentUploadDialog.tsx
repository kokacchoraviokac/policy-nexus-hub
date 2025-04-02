
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, FileUp, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUploadForm from "./DocumentUploadForm";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { Document, DocumentCategory, EntityType } from "@/types/documents";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  selectedDocument?: Document;
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
  salesStage: initialSalesStage
}) => {
  const { t } = useLanguage();
  const [uploadMode, setUploadMode] = useState<"new" | "version">(selectedDocument ? "version" : "new");
  
  const {
    documentName,
    setDocumentName,
    documentType,
    setDocumentType,
    documentCategory,
    setDocumentCategory,
    salesStage,
    setSalesStage,
    file,
    setFile,
    uploading,
    handleUpload,
  } = useDocumentManager(entityType, entityId);

  const isNewVersion = uploadMode === "version" && !!selectedDocument;
  
  // Pre-fill form if uploading a new version
  useEffect(() => {
    if (isNewVersion && selectedDocument) {
      setDocumentName(selectedDocument.document_name);
      setDocumentType(selectedDocument.document_type);
      if (selectedDocument.category) {
        setDocumentCategory(selectedDocument.category as DocumentCategory);
      }
    } else {
      // Reset form when switching to new document
      setDocumentName("");
      setDocumentType("");
      if (defaultCategory) {
        setDocumentCategory(defaultCategory);
      } else {
        setDocumentCategory("");
      }
    }
  }, [isNewVersion, selectedDocument, setDocumentName, setDocumentType, setDocumentCategory, defaultCategory]);

  // Set sales stage if provided
  useEffect(() => {
    if (initialSalesStage && setSalesStage) {
      setSalesStage(initialSalesStage);
    }
  }, [initialSalesStage, setSalesStage]);

  const handleCloseDialog = () => {
    if (!uploading) {
      onOpenChange(false);
    }
  };

  const handleSubmit = () => {
    if (isNewVersion && selectedDocument) {
      handleUpload(
        selectedDocument.original_document_id || selectedDocument.id,
        selectedDocument.version || 1
      );
    } else {
      handleUpload();
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const isValid = !!file && !!documentName && !!documentType;
  
  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isNewVersion ? t("uploadNewVersion") : t("uploadDocument")}
          </DialogTitle>
        </DialogHeader>
        
        {selectedDocument && (
          <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as "new" | "version")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">{t("newDocument")}</TabsTrigger>
              <TabsTrigger value="version">{t("newVersion")}</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <DocumentUploadForm
          documentName={documentName}
          setDocumentName={setDocumentName}
          documentType={documentType}
          setDocumentType={setDocumentType}
          documentCategory={documentCategory}
          setDocumentCategory={setDocumentCategory}
          file={file}
          setFile={setFile}
          isSalesProcess={entityType === "sales_process"}
          salesStage={salesStage}
          setSalesStage={setSalesStage}
          isNewVersion={isNewVersion}
        />
        
        {isNewVersion && selectedDocument && (
          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="font-medium flex items-center">
              <History className="h-4 w-4 mr-2" />
              {t("versionInfo")}
            </p>
            <p className="text-muted-foreground mt-1">
              {t("updatingDocumentVersion", { 
                name: selectedDocument.document_name,
                version: selectedDocument.version || 1
              })}
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog} disabled={uploading}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValid || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")}
              </>
            ) : isNewVersion ? (
              <>
                <History className="mr-2 h-4 w-4" />
                {t("uploadVersion")}
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
