import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import { FilePlus, Upload, X } from "lucide-react";
import { uploadDocument } from "@/utils/documents";
import { useActivityLogger } from "@/utils/activityLogger";
import { EntityType } from "@/types/documents";

interface DocumentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onClose,
  onSuccess,
  entityId,
  entityType,
  originalDocumentId,
  currentVersion
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { logActivity } = useActivityLogger();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: t("noFileSelected"),
        description: t("pleaseSelectFileToUpload"),
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await uploadDocument({
        file,
        documentName,
        documentType,
        category: documentCategory,
        entityId,
        entityType: "policy" as EntityType,
        originalDocumentId,
        currentVersion
      });

      if (result.success) {
        // Log activity
        await logActivity({
          entity_type: "policy", // Use entity_type instead of entityType
          entity_id: entityId,
          action: "upload",
          details: {
            document_name: documentName,
            document_type: documentType,
            timestamp: new Date().toISOString()
          }
        });

        onSuccess();
        onClose();
        
        toast({
          title: t("documentUploaded"),
          description: t("documentUploadedSuccessfully"),
        });
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: t("errorUploadingDocument"),
        description: t("errorOccurredWhileUploading"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("uploadDocument")}</DialogTitle>
          <DialogDescription>
            {t("uploadNewDocumentToPolicy")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t("documentName")}
            </Label>
            <Input
              id="name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              {t("documentType")}
            </Label>
            <Input
              id="type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              {t("documentCategory")}
            </Label>
            <Select onValueChange={setDocumentCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">{t("contract")}</SelectItem>
                <SelectItem value="invoice">{t("invoice")}</SelectItem>
                <SelectItem value="claim">{t("claim")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("uploadFile")}</Label>
            <div
              {...getRootProps()}
              className="dropzone col-span-3 flex flex-col items-center justify-center border-dashed border-2 border-gray-400 bg-gray-50 rounded-lg cursor-pointer"
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex items-center justify-between w-full p-4">
                  <span className="text-sm text-gray-500">{file.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <FilePlus className="h-6 w-6 text-gray-500 mb-2" />
                  <p className="text-sm text-gray-500">
                    {t("dragAndDropFilesHere")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("or")} {t("clickToSelectFiles")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            <Upload className="w-4 h-4 mr-2" />
            {t("upload")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
