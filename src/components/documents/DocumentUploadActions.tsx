
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Loader2, FileUp, History } from "lucide-react";

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
    <>
      <Button variant="outline" onClick={onCancel} disabled={uploading}>
        {t("cancel")}
      </Button>
      <Button onClick={onUpload} disabled={!canUpload || uploading}>
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("uploading")}
          </>
        ) : isNewVersion ? (
          <>
            <History className="mr-2 h-4 w-4" />
            {t("uploadNewVersion")}
          </>
        ) : (
          <>
            <FileUp className="mr-2 h-4 w-4" />
            {t("upload")}
          </>
        )}
      </Button>
    </>
  );
};

export default DocumentUploadActions;
