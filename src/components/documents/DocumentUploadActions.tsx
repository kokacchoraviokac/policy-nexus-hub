
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";

interface DocumentUploadActionsProps {
  uploading: boolean;
  isNewVersion: boolean;
  canUpload: boolean;
  onCancel: () => void;
  onUpload: () => void;
}

const DocumentUploadActions: React.FC<DocumentUploadActionsProps> = ({
  uploading,
  isNewVersion,
  canUpload,
  onCancel,
  onUpload
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <Button variant="outline" onClick={onCancel} disabled={uploading}>
        {t("cancel")}
      </Button>
      <Button onClick={onUpload} disabled={!canUpload || uploading}>
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
    </div>
  );
};

export default DocumentUploadActions;
