
import React, { useState } from "react";
import { FileUp, Loader2, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import DocumentTypeSelector from "@/components/documents/DocumentTypeSelector";
import DocumentCategorySelector from "@/components/documents/DocumentCategorySelector";
import FileUploadField from "@/components/documents/FileUploadField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "@/types/documents";

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
  React.useEffect(() => {
    if (isNewVersion && selectedDocument) {
      setDocumentName(selectedDocument.document_name);
      setDocumentType(selectedDocument.document_type);
      if (selectedDocument.category) {
        setDocumentCategory(selectedDocument.category);
      }
    }
  }, [isNewVersion, selectedDocument, setDocumentName, setDocumentType, setDocumentCategory]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="documentName" className="text-sm font-medium">{t("documentName")} *</label>
            <input
              id="documentName"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={t("enterDocumentName")}
              disabled={isNewVersion}
            />
          </div>
          
          <DocumentTypeSelector 
            value={documentType} 
            onValueChange={setDocumentType}
            disabled={isNewVersion}
          />
          
          <DocumentCategorySelector
            value={documentCategory}
            onValueChange={setDocumentCategory}
            disabled={isNewVersion}
          />
          
          <FileUploadField 
            onChange={handleFileChange}
            file={file}
          />
          
          {isNewVersion && (
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
              <p className="font-medium">{t("uploadingNewVersion")}:</p>
              <p className="mt-1">{t("documentVersionInfo", { current: selectedDocument?.version || 1, new: (selectedDocument?.version || 1) + 1 })}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            {t("cancel")}
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading || !documentName}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")}
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                {isNewVersion ? t("uploadVersion") : t("upload")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
