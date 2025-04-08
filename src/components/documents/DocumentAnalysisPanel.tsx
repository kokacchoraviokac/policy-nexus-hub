
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useDocumentAnalysis } from "@/hooks/useDocumentAnalysis";
import { useDocumentTextExtraction } from "@/hooks/useDocumentTextExtraction";
import { DocumentCategory } from "@/types/documents";
import AnalysisTabsList from "./analysis/AnalysisTabsList";
import AnalysisTabs from "./analysis/AnalysisTabs";
import AnalysisActionButton from "./analysis/AnalysisActionButton";

interface DocumentAnalysisPanelProps {
  file: File | null;
  onCategoryDetected?: (category: DocumentCategory) => void;
  documentType?: string;
  documentCategory?: string;
  className?: string;
}

const DocumentAnalysisPanel: React.FC<DocumentAnalysisPanelProps> = ({
  file,
  onCategoryDetected,
  documentType,
  documentCategory,
  className
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("classify");
  
  const { documentText, isExtracting } = useDocumentTextExtraction(file);
  
  const { 
    isAnalyzing, 
    result, 
    error,
    classifyDocument,
    extractData,
    summarizeDocument
  } = useDocumentAnalysis({
    onSuccess: (data) => {
      if (data?.success && data?.analysisType === "classify" && onCategoryDetected) {
        // Try to match the returned category to a valid DocumentCategory
        const detectedCategory = data.analysis?.trim().toLowerCase() as DocumentCategory;
        const validCategories: DocumentCategory[] = [
          "policy", "claim", "client", "invoice", "other", 
          "claim_evidence", "medical", "legal", "financial", 
          "lien", "notification", "correspondence"
        ];
        
        if (validCategories.includes(detectedCategory)) {
          onCategoryDetected(detectedCategory);
          toast({
            title: t("categoryDetected"),
            description: t("documentCategoryDetectedAs", { category: t(detectedCategory) }),
          });
        }
      }
    },
    onError: (errorMsg) => {
      toast({
        title: t("analysisError"),
        description: errorMsg,
        variant: "destructive",
      });
    }
  });

  const handleAnalyze = async () => {
    if (!documentText) {
      toast({
        title: t("noTextAvailable"),
        description: t("pleaseUploadValidDocument"),
        variant: "destructive",
      });
      return;
    }

    switch (activeTab) {
      case "classify":
        await classifyDocument(documentText);
        break;
      case "extract":
        await extractData(documentText, documentType, documentCategory);
        break;
      case "summarize":
        await summarizeDocument(documentText, documentType);
        break;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t("documentAnalysis")}</CardTitle>
        <CardDescription>
          {t("useAIToAnalyzeDocument")}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <AnalysisTabsList activeTab={activeTab} setActiveTab={setActiveTab} />
          <AnalysisTabs activeTab={activeTab} result={result} error={error} />
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <AnalysisActionButton 
          onAnalyze={handleAnalyze}
          isExtracting={isExtracting}
          isAnalyzing={isAnalyzing}
          hasFile={!!file}
        />
      </CardFooter>
    </Card>
  );
};

export default DocumentAnalysisPanel;
