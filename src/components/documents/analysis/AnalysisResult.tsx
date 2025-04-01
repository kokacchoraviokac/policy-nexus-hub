
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AnalysisResultProps {
  result: {
    success: boolean;
    analysis: string;
  } | null;
  error: string | null;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, error }) => {
  const { t } = useLanguage();

  // Helper to format JSON nicely if the result is JSON
  const formatResult = (analysisResult: string) => {
    try {
      // Check if the result is JSON
      const parsedJson = JSON.parse(analysisResult);
      return (
        <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] text-xs">
          {JSON.stringify(parsedJson, null, 2)}
        </pre>
      );
    } catch (e) {
      // If not JSON, return as text
      return (
        <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
          {analysisResult}
        </div>
      );
    }
  };

  if (!result && !error) return null;

  return (
    <div className="mt-4">
      {result?.success && (
        <>
          <h4 className="font-medium mb-2">{t("analysisResult")}</h4>
          {formatResult(result.analysis)}
        </>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
          <h4 className="font-medium mb-2">{t("error")}</h4>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
