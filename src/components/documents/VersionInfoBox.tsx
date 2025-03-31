
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document } from "@/types/documents";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { History } from "lucide-react";

interface VersionInfoBoxProps {
  isNewVersion: boolean;
  selectedDocument?: Document;
}

const VersionInfoBox: React.FC<VersionInfoBoxProps> = ({
  isNewVersion,
  selectedDocument
}) => {
  const { t } = useLanguage();
  
  if (!isNewVersion || !selectedDocument) {
    return null;
  }
  
  return (
    <Alert className="mb-2">
      <History className="h-4 w-4" />
      <AlertTitle>{t("uploadNewVersion")}</AlertTitle>
      <AlertDescription className="text-sm">
        {t("uploadNewVersionDescription", {
          name: selectedDocument.document_name,
          version: selectedDocument.version || 1,
          nextVersion: (selectedDocument.version || 1) + 1
        })}
      </AlertDescription>
    </Alert>
  );
};

export default VersionInfoBox;
