
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, History } from "lucide-react";

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
    <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as "new" | "version")}>
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="new" className="flex items-center space-x-2">
          <File className="h-4 w-4" />
          <span>{t("newDocument")}</span>
        </TabsTrigger>
        <TabsTrigger value="version" className="flex items-center space-x-2">
          <History className="h-4 w-4" />
          <span>{t("newVersion")}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DocumentUploadTabs;
