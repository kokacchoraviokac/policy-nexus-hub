
import React, { useState, useEffect } from "react";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { DocumentAnalysisPanelProps, DocumentCategory } from "@/types/documents";

const DocumentAnalysisPanel: React.FC<DocumentAnalysisPanelProps> = ({
  document,
  onAnalysisComplete
}) => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);
  
  // Simulate document analysis process
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let currentProgress = 0;
    
    const incrementProgress = () => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(timer);
        setAnalyzing(false);
        if (onAnalysisComplete) {
          onAnalysisComplete({
            categories: [DocumentCategory.POLICY, DocumentCategory.INVOICE],
            extractedData: {
              title: document?.document_name || "Unknown document",
              date: new Date().toISOString()
            }
          });
        }
      }
    };
    
    timer = setInterval(incrementProgress, 200);
    
    return () => {
      clearInterval(timer);
    };
  }, [document, onAnalysisComplete]);
  
  if (!document) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            {t("noDocumentSelected")}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-medium">{document.document_name}</h3>
              <p className="text-sm text-muted-foreground">
                {document.mime_type ? document.mime_type : "Unknown type"}
              </p>
            </div>
            
            {analyzing ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {t("analyzingDocument")}
                  </p>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {t("analysisComplete")}
                  </p>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-primary/10">
                    {t("policy")}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    {t("invoice")}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysisPanel;
