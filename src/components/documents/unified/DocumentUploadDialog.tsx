
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { FileUp, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DocumentUploadForm from "./DocumentUploadForm";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  entityId: string;
  onSuccess?: () => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  onSuccess
}) => {
  const { t } = useLanguage();
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async () => {
    if (!file || !documentName || !documentType) {
      toast.warning(t("missingRequiredFields"));
      return;
    }
    
    setUploading(true);
    
    try {
      // In a real implementation, this would call an API to upload the document
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast.success(t("documentUploadedSuccessfully"));
      resetForm();
      
      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(t("documentUploadFailed"));
    } finally {
      setUploading(false);
    }
  };
  
  const resetForm = () => {
    setDocumentName("");
    setDocumentType("");
    setDocumentCategory("");
    setFile(null);
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!uploading) {
        onOpenChange(open);
        if (!open) resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("uploadDocument")}</DialogTitle>
        </DialogHeader>
        
        <DocumentUploadForm
          documentName={documentName}
          setDocumentName={setDocumentName}
          documentType={documentType}
          setDocumentType={setDocumentType}
          documentCategory={documentCategory}
          setDocumentCategory={setDocumentCategory}
          file={file}
          setFile={setFile}
        />
        
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={uploading || !file || !documentName || !documentType}
          >
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
