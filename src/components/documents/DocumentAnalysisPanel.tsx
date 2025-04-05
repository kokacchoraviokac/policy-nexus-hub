
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { DocumentAnalysisPanelProps } from "@/types/documents";

const AnalysisTabs = ({ activeTab, result, error }: { activeTab: string, result: any, error: string | null }) => {
  const { t } = useLanguage();
  
  if (activeTab === "classify" && result) {
    try {
      const classification = typeof result.analysis === 'string' ? JSON.parse(result.analysis) : result.analysis;
      return (
        <div className="p-4 border rounded-lg mt-4">
          <h4 className="font-medium mb-2">{t("categoryDetected")}</h4>
          <p className="text-sm">{t("documentCategoryDetectedAs", { category: classification.documentType })}</p>
          <p className="text-xs text-muted-foreground mt-2">Confidence: {Math.round(classification.confidence * 100)}%</p>
        </div>
      );
    } catch (e) {
      return <div className="text-sm text-destructive">{t("analysisError")}</div>;
    }
  }
  
  if (activeTab === "extract" && result) {
    try {
      const data = typeof result.analysis === 'string' ? JSON.parse(result.analysis) : result.analysis;
      return (
        <div className="p-4 border rounded-lg mt-4">
          <h4 className="font-medium mb-2">{t("extractedData")}</h4>
          <div className="text-sm space-y-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="grid grid-cols-3">
                <span className="font-medium">{key}:</span>
                <span className="col-span-2">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } catch (e) {
      return <div className="text-sm text-destructive">{t("textExtractionError")}</div>;
    }
  }
  
  if (activeTab === "summarize" && result) {
    return (
      <div className="p-4 border rounded-lg mt-4">
        <h4 className="font-medium mb-2">{t("documentSummary")}</h4>
        <p className="text-sm">{result.analysis}</p>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-sm text-destructive mt-4">{error}</div>;
  }
  
  return null;
};

const AnalysisTabsList = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex space-x-1 rounded-lg bg-muted p-1">
      <button
        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${
          activeTab === "classify" ? "bg-white shadow" : "text-muted-foreground"
        }`}
        onClick={() => setActiveTab("classify")}
      >
        {t("classify")}
      </button>
      <button
        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${
          activeTab === "extract" ? "bg-white shadow" : "text-muted-foreground"
        }`}
        onClick={() => setActiveTab("extract")}
      >
        {t("extract")}
      </button>
      <button
        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${
          activeTab === "summarize" ? "bg-white shadow" : "text-muted-foreground"
        }`}
        onClick={() => setActiveTab("summarize")}
      >
        {t("summarize")}
      </button>
    </div>
  );
};

const DocumentAnalysisPanel: React.FC<DocumentAnalysisPanelProps> = (props) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("classify");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    analysis: string;
    analysisType?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleAnalyze = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result based on selected tab
      let mockResult;
      switch (activeTab) {
        case 'classify':
          mockResult = {
            success: true,
            analysis: JSON.stringify({
              documentType: "invoice",
              confidence: 0.92,
              possibleTypes: ["invoice", "receipt", "statement"]
            }),
            analysisType: "classification"
          };
          
          if (props.onCategoryDetected) {
            props.onCategoryDetected("invoice");
          }
          break;
        case 'extract':
          mockResult = {
            success: true,
            analysis: JSON.stringify({
              invoiceNumber: "INV-2023-00123",
              date: "2023-05-15",
              totalAmount: 1250.50,
              currency: "USD",
              vendor: "Acme Corp"
            }),
            analysisType: "extraction"
          };
          break;
        case 'summarize':
          mockResult = {
            success: true,
            analysis: "This document is an invoice from Acme Corp dated May 15, 2023 for services rendered. The total amount is $1,250.50 with payment terms of Net 30 days.",
            analysisType: "summary"
          };
          break;
        default:
          mockResult = {
            success: false,
            analysis: "Unknown analysis type",
            analysisType: "unknown"
          };
      }
      
      setResult(mockResult);
      
      if (props.onAnalysisComplete) {
        props.onAnalysisComplete(mockResult);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">{t("documentAnalysis")}</h3>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <AnalysisTabsList activeTab={activeTab} setActiveTab={setActiveTab} />
          <AnalysisTabs activeTab={activeTab} result={result} error={error} />
          
          <div className="mt-6">
            <Button 
              onClick={handleAnalyze}
              disabled={isProcessing}
            >
              {isProcessing ? t("analyzing") : t("analyze")}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysisPanel;
