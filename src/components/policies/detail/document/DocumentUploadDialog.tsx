
import React from "react";
import { FileUp, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import DocumentTypeSelector from "./DocumentTypeSelector";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: "policy" | "claim" | "client" | "insurer" | "sales_process" | "agent";
  entityId: string;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId
}) => {
  const { t } = useLanguage();
  
  const {
    documentName,
    setDocumentName,
    documentType, 
    setDocumentType,
    file,
    handleFileChange,
    uploading,
    handleUpload
  } = useDocumentUpload({ 
    entityType,
    entityId,
    onSuccess: () => onOpenChange(false)
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("uploadDocument")}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="documentName">{t("documentName")} *</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={t("enterDocumentName")}
            />
          </div>
          
          <DocumentTypeSelector 
            value={documentType} 
            onValueChange={setDocumentType} 
          />
          
          <div className="grid gap-2">
            <Label htmlFor="file">{t("selectFile")} *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
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
