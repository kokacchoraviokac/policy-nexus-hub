
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TabsContent } from "@/components/ui/tabs";
import AnalysisResult from "./AnalysisResult";

interface AnalysisTabsProps {
  activeTab: string;
  result: {
    success: boolean;
    analysis: string;
    analysisType?: string;
  } | null;
  error: string | null;
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ activeTab, result, error }) => {
  const { t } = useLanguage();

  return (
    <>
      <TabsContent value="classify">
        <p className="text-sm text-muted-foreground mb-4">
          {t("classifyDocumentDescription")}
        </p>
      </TabsContent>
      
      <TabsContent value="extract">
        <p className="text-sm text-muted-foreground mb-4">
          {t("extractDataDescription")}
        </p>
      </TabsContent>
      
      <TabsContent value="summarize">
        <p className="text-sm text-muted-foreground mb-4">
          {t("summarizeDocumentDescription")}
        </p>
      </TabsContent>
      
      <AnalysisResult result={result} error={error} />
    </>
  );
};

export default AnalysisTabs;
