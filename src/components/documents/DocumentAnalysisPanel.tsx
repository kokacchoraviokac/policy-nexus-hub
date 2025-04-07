
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { DocumentCategory } from "@/types/documents";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentAnalysisPanelProps {
  file: File;
  onCategoryDetected: (category: DocumentCategory) => void;
  onAnalysisComplete: () => void;
}

const DocumentAnalysisPanel: React.FC<DocumentAnalysisPanelProps> = ({
  file,
  onCategoryDetected,
  onAnalysisComplete
}) => {
  const { t } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<DocumentCategory | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      analyzeDocument();
    }
  }, [file]);

  const analyzeDocument = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate document analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demonstration, randomly select a document category
      const categories = Object.values(DocumentCategory);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)] as DocumentCategory;
      const randomConfidence = Math.floor(Math.random() * 40) + 60; // 60-99% confidence
      
      setDetectedCategory(randomCategory);
      setConfidence(randomConfidence);
      onCategoryDetected(randomCategory);
      onAnalysisComplete();
    } catch (err) {
      console.error("Error analyzing document:", err);
      setError(t("analysisError"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("documentAnalysis")}</h3>
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">{t("analyzingDocument")}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-destructive">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={analyzeDocument}
            >
              {t("tryAgain")}
            </Button>
          </div>
        ) : detectedCategory ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">{t("analysisComplete")}</span>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">{t("detectedCategory")}</p>
              <Badge variant="outline" className="text-sm">
                {t(detectedCategory)}
              </Badge>
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("confidence")}: {confidence}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">{t("selectDocumentForAnalysis")}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DocumentAnalysisPanel;
