import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, CheckCircle2, XCircle } from "lucide-react";
import { DocumentCategory } from "@/types/documents";

interface DocumentAnalysisPanelProps {
  documentType: string;
  file?: File | null;
  onCategoryDetected?: (category: DocumentCategory) => void;
}

const DocumentAnalysisPanel: React.FC<DocumentAnalysisPanelProps> = ({
  documentType,
  file,
  onCategoryDetected
}) => {
  const { t } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!file) return;
    
    const analyzeDocument = () => {
      setIsAnalyzing(true);
      setProcessingError(null);
      
      setTimeout(() => {
        try {
          const detectedCategory = 
            documentType.includes('policy') ? 'policy' :
            documentType.includes('claim') ? 'claim' :
            documentType.includes('invoice') ? 'invoice' :
            documentType.includes('legal') ? 'legal' : 'other';
          
          const mockAnalysis = {
            category: detectedCategory,
            confidence: 0.87,
            attributes: {
              documentType: documentType,
              detectedEntities: ["dates", "amounts", "parties"],
              content: "Document appears to be a standardized " + documentType,
              relevance: "High"
            }
          };
          
          setAnalysis(mockAnalysis);
          
          if (onCategoryDetected) {
            onCategoryDetected(detectedCategory as DocumentCategory);
          }
        } catch (error) {
          setProcessingError(t("documentAnalysisError"));
          console.error("Error analyzing document:", error);
        } finally {
          setIsAnalyzing(false);
        }
      }, 2000);
    };
    
    analyzeDocument();
  }, [file, documentType, onCategoryDetected, t]);
  
  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{t("analysingDocument")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-pulse flex space-x-2 items-center mb-3">
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-3 w-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-sm text-muted-foreground">{t("documentBeingProcessed")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (processingError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span>{t("documentAnalysisFailed")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-center py-6">
            <p className="text-sm text-destructive mb-4">{processingError}</p>
            <p className="text-xs text-muted-foreground">{t("pleaseProcessManually")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!file || !analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("documentAnalysis")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-center py-6">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{file ? t("analyzingDocument") : t("noDocumentSelected")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{t("aiAnalysisResults")}</span>
          </div>
          <Badge variant="outline" className="ml-auto">
            {Math.round(analysis.confidence * 100)}% {t("confident")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="font-medium">{t("detectedCategory")}:</span>
            </div>
            <Badge variant="secondary">
              {t(analysis.category)}
            </Badge>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">{t("detectedAttributes")}</h4>
            <ul className="space-y-1">
              {analysis.attributes.detectedEntities.map((entity: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <CheckCircle2 className="h-3 w-3 text-green-500 mr-2" />
                  {t(entity)}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">{t("summary")}</h4>
            <p className="text-sm text-muted-foreground">{analysis.attributes.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysisPanel;
