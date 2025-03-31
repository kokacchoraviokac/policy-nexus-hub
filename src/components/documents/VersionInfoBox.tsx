
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document } from "@/types/documents";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  
  if (!isNewVersion || !selectedDocument) return null;
  
  const newVersion = (selectedDocument.version || 1) + 1;
  
  return (
    <Alert className="mt-2 mb-4">
      <History className="h-4 w-4" />
      <AlertDescription>
        {t("documentVersionInfo", { 
          current: selectedDocument.version || 1, 
          new: newVersion 
        })}
      </AlertDescription>
    </Alert>
  );
};

export default VersionInfoBox;
