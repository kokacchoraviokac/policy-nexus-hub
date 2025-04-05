
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import AnalysisTabs from "./analysis/AnalysisTabs";
import AnalysisTabsList from "./analysis/AnalysisTabsList";

interface DocumentAnalysisPanelProps {
  documentId: string;
  documentUrl: string;
  documentType: string;
  file?: File | null; // Make file optional
  onAnalysisComplete?: (result: any) => void;
  onCategoryDetected?: (category: string) => void;
}

const DocumentAnalysisPanel: React.FC<DocumentAnalysisPanelProps> = ({
  documentId,
  documentUrl,
  documentType,
  file,
  onAnalysisComplete,
  onCategoryDetected
}) => {
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
          
          if (onCategoryDetected) {
            onCategoryDetected("invoice");
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
      
      if (onAnalysisComplete) {
        onAnalysisComplete(mockResult);
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
