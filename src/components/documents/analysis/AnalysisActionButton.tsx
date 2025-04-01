
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AnalysisActionButtonProps {
  onAnalyze: () => void;
  isExtracting: boolean;
  isAnalyzing: boolean;
  hasFile: boolean;
}

const AnalysisActionButton: React.FC<AnalysisActionButtonProps> = ({
  onAnalyze,
  isExtracting,
  isAnalyzing,
  hasFile
}) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      onClick={onAnalyze}
      disabled={isExtracting || isAnalyzing || !hasFile}
      className="w-full"
    >
      {(isExtracting || isAnalyzing) ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isExtracting ? t("extractingText") : t("analyzing")}
        </>
      ) : (
        t("analyzeDocument")
      )}
    </Button>
  );
};

export default AnalysisActionButton;
