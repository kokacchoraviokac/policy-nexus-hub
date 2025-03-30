
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document } from "@/types/documents";

interface VersionInfoBoxProps {
  isNewVersion: boolean;
  selectedDocument?: Document;
}

const VersionInfoBox: React.FC<VersionInfoBoxProps> = ({ 
  isNewVersion, 
  selectedDocument 
}) => {
  const { t } = useLanguage();
  
  if (!isNewVersion) return null;
  
  return (
    <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
      <p className="font-medium">{t("uploadingNewVersion")}:</p>
      <p className="mt-1">
        {t("documentVersionInfo", { 
          current: selectedDocument?.version || 1, 
          new: (selectedDocument?.version || 1) + 1 
        })}
      </p>
    </div>
  );
};

export default VersionInfoBox;
