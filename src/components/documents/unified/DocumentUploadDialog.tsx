
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDocumentTypeOptions } from "@/services/documentTypes";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  selectedDocument?: Document;
  onUploadComplete?: () => void;
  embedMode?: boolean;
  onFileSelected?: (file: File | null) => void;
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
  
  // Pass file to parent if needed
  useEffect(() => {
    if (onFileSelected) {
      onFileSelected(file);
    }
  }, [file, onFileSelected]);
  
  // Pre-fill form if uploading a new version
  useEffect(() => {
    if (isNewVersion && selectedDocument) {
      setDocumentName(selectedDocument.document_name);
      setDocumentType(selectedDocument.document_type || "other");
      if (selectedDocument.category) {
        setDocumentCategory(selectedDocument.category as DocumentCategory);
      } else {
        setDocumentCategory("other" as DocumentCategory);
      }
    }
  }, [isNewVersion, selectedDocument, setDocumentName, setDocumentType, setDocumentCategory]);

  const canUpload = !!file && !!documentName;
  
  // Get document type options for the entity type
  const documentTypeOptions = getDocumentTypeOptions(entityType);
  
  // Get category options based on entity type
  const categoryOptions = [
    { label: t("policy"), value: "policy" },
    { label: t("claim"), value: "claim" },
    { label: t("invoice"), value: "invoice" },
    { label: t("contract"), value: "contract" },
    { label: t("report"), value: "report" },
    { label: t("certificate"), value: "certificate" },
    { label: t("other"), value: "other" }
  ];
  
  if (entityType === 'sales_process') {
    categoryOptions.push(
      { label: t("discovery"), value: "discovery" },
      { label: t("quoteManagement"), value: "quote" },
      { label: t("proposals"), value: "proposal" },
      { label: t("contracts"), value: "contract" },
      { label: t("closeout"), value: "closeout" }
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={embedMode ? undefined : onOpenChange}>
      <DialogContent className={embedMode ? "border-0 shadow-none p-0" : "sm:max-w-[500px]"}>
        {!embedMode && (
          <DialogHeader>
            <DialogTitle>
              {isNewVersion ? t("uploadNewVersion") : t("uploadDocument")}
            </DialogTitle>
          </DialogHeader>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="documentName">{t("documentName")}</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={t("enterDocumentName")}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="documentType">{t("documentType")}</Label>
            <Select
              value={documentType}
              onValueChange={setDocumentType}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectDocumentType")} />
              </SelectTrigger>
              <SelectContent>
                {documentTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">{t("category")}</Label>
            <Select
              value={documentCategory || "other"}
              onValueChange={(value) => setDocumentCategory(value as DocumentCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="file">{t("file")}</Label>
            <div className="border border-input rounded-md p-4 relative flex flex-col items-center justify-center text-center">
              <input
                type="file"
                id="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-muted-foreground mb-2">{t("dragAndDropFilesHere")}</p>
              <p className="text-xs text-muted-foreground">
                {t("or")} <span className="underline">{t("clickToSelectFiles")}</span>
              </p>
              {file && (
                <div className="mt-2 text-sm font-medium">{file.name}</div>
              )}
            </div>
          </div>
        </div>
        
        {!embedMode && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
              {t("cancel")}
            </Button>
            <Button onClick={handleUpload} disabled={!canUpload || uploading}>
              {uploading ? (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
