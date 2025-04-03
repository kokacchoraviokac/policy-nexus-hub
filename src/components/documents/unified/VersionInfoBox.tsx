
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Document } from "@/types/documents";

interface VersionInfoBoxProps {
  selectedDocument?: Document;
}

const VersionInfoBox: React.FC<VersionInfoBoxProps> = ({ selectedDocument }) => {
  const { t, formatDate } = useLanguage();
  
  if (!selectedDocument) return null;
  
  return (
    <Alert variant="default" className="my-4">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>{t("uploadingNewVersion")}</AlertTitle>
      <AlertDescription>
        {t("uploadingNewVersionOf", { name: selectedDocument.document_name })}
        <div className="text-xs mt-1 text-muted-foreground">
          {t("currentVersion")}: v{selectedDocument.version} ({formatDate(selectedDocument.created_at)})
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default VersionInfoBox;
