
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSearch, FileText, FileDigit } from "lucide-react";

interface AnalysisTabsListProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AnalysisTabsList: React.FC<AnalysisTabsListProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const { t } = useLanguage();

  return (
    <TabsList className="grid grid-cols-3 mb-4">
      <TabsTrigger value="classify" className="flex items-center gap-2">
        <FileSearch className="h-4 w-4" />
        {t("classify")}
      </TabsTrigger>
      <TabsTrigger value="extract" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        {t("extract")}
      </TabsTrigger>
      <TabsTrigger value="summarize" className="flex items-center gap-2">
        <FileDigit className="h-4 w-4" />
        {t("summarize")}
      </TabsTrigger>
    </TabsList>
  );
};

export default AnalysisTabsList;
