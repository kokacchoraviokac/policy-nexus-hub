import React, { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import { Policy } from "@/types/policies";
import { toast } from "sonner";

interface UploadSignedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy;
  onUploadComplete: (file: File, notes: string) => void;
}

const UploadSignedDialog: React.FC<UploadSignedDialogProps> = ({
  open,
  onOpenChange,
  policy,
  onUploadComplete,
}) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(t("invalidFileType"));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("fileTooLarge"));
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(t("pleaseSelectFile"));
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("Uploading signed policy:", {
        policyId: policy.id,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        notes,
      });

      toast.success(t("signedPolicyUploadedSuccessfully"), {
        description: t("readyToSendToInsurer"),
      });

      onUploadComplete(selectedFile, notes);
      onOpenChange(false);

      // Reset form
      setSelectedFile(null);
      setNotes("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading signed policy:", error);
      toast.error(t("errorUploadingFile"));
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t("uploadSignedPolicy")}
          </DialogTitle>
          <DialogDescription>
            {t("uploadSignedPolicyFromClient")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Policy Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("policyDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t("policyNumber")}:</span>
                  <p className="text-muted-foreground">{policy.policy_number}</p>
                </div>
                <div>
                  <span className="font-medium">{t("client")}:</span>
                  <p className="text-muted-foreground">{policy.policyholder_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">{t("selectSignedPolicyFile")}*</Label>
              <div className="mt-2">
                {!selectedFile ? (
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("clickToSelectFile")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG (max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t("additionalNotes")}</Label>
              <Textarea
                id="notes"
                placeholder={t("enterNotesAboutSignature")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("uploading")}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t("uploadPolicy")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadSignedDialog;