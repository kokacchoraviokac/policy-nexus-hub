
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentUploadTabsProps {
  uploadMode: "new" | "version";
  setUploadMode: (value: "new" | "version") => void;
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
    <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as "new" | "version")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="new">{t("newDocument")}</TabsTrigger>
        <TabsTrigger value="version">{t("newVersion")}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DocumentUploadTabs;
