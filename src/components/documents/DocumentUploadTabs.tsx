
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentUploadTabsProps {
  uploadMode: "new" | "version";
  setUploadMode: (mode: "new" | "version") => void;
  showTabs: boolean;
}

const DocumentUploadTabs: React.FC<DocumentUploadTabsProps> = ({
  uploadMode,
  setUploadMode,
  showTabs
}) => {
  const { t } = useLanguage();
  
  if (!showTabs) return null;
  
  return (
    <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as "new" | "version")} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="new">{t("uploadDocument")}</TabsTrigger>
        <TabsTrigger value="version">{t("uploadNewVersion")}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DocumentUploadTabs;
