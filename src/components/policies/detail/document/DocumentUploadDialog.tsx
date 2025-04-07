
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileUploader } from "@/components/ui/file-uploader";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { EntityType, DocumentCategory } from "@/types/common";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityId: string;
  onSuccess?: () => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityId,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState("");
  
  const {
    documentName,
    setDocumentName,
    file,
    handleFileChange,
    uploading,
    handleUpload,
    setDocumentType: setUploadDocumentType,
    setDocumentCategory
  } = useDocumentUpload({
    entityType: EntityType.POLICY,
    entityId,
    onSuccess: () => {
      onOpenChange(false);
      if (onSuccess) onSuccess();
      toast({
        title: t("documentUploaded"),
        description: t("documentUploadedSuccessfully"),
      });
    }
  });
  
  // Sync local state with hook state
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
    setUploadDocumentType(value);
    // Set document category based on document type
    if (value === 'policy') {
      setDocumentCategory(DocumentCategory.POLICY);
    } else if (value === 'claim') {
      setDocumentCategory(DocumentCategory.CLAIM);
    } else if (value === 'invoice') {
      setDocumentCategory(DocumentCategory.INVOICE);
    } else if (value === 'contract') {
      setDocumentCategory(DocumentCategory.CONTRACT);
    } else {
      setDocumentCategory(DocumentCategory.OTHER);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName || !documentType || !file) {
      toast({
        title: t("validationError"),
        description: t("pleaseCompleteAllFields"),
        variant: "destructive",
      });
      return;
    }
    
    await handleUpload();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("uploadDocument")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">{t("documentName")}</Label>
            <Input
              id="document-name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={t("enterDocumentName")}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-type">{t("documentType")}</Label>
            <Select
              value={documentType}
              onValueChange={handleDocumentTypeChange}
              required
            >
              <SelectTrigger id="document-type">
                <SelectValue placeholder={t("selectDocumentType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="policy">{t("policyDocument")}</SelectItem>
                <SelectItem value="certificate">{t("certificate")}</SelectItem>
                <SelectItem value="invoice">{t("invoice")}</SelectItem>
                <SelectItem value="terms">{t("termsAndConditions")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>{t("file")}</Label>
            <FileUploader
              onFileSelect={(file) => handleFileChange(file)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              uploading={uploading}
              selectedFile={file}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              {t("cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || !documentName || !documentType || !file}
            >
              {uploading ? t("uploading") : t("upload")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
