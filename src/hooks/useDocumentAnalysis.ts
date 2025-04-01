
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AnalysisType = "classify" | "extract" | "summarize";

interface UseDocumentAnalysisParams {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export const useDocumentAnalysis = ({ onSuccess, onError }: UseDocumentAnalysisParams = {}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeDocument = async (
    documentText: string, 
    analysisType: AnalysisType, 
    documentType?: string,
    documentCategory?: string
  ) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("document-analysis", {
        body: {
          documentText,
          analysisType,
          documentType,
          documentCategory
        }
      });

      if (error) {
        console.error("Document analysis error:", error);
        setError(error.message);
        if (onError) onError(error.message);
        return null;
      }

      setResult(data);
      if (onSuccess) onSuccess(data);
      return data;
    } catch (err: any) {
      console.error("Document analysis exception:", err);
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      if (onError) onError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeDocument,
    isAnalyzing,
    result,
    error,
    classifyDocument: (text: string) => analyzeDocument(text, "classify"),
    extractData: (text: string, docType?: string, docCategory?: string) => 
      analyzeDocument(text, "extract", docType, docCategory),
    summarizeDocument: (text: string, docType?: string) => 
      analyzeDocument(text, "summarize", docType)
  };
};
