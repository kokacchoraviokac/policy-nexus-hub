
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, FileSearch, FileDigit } from "lucide-react";
import { useDocumentAnalysis } from "@/hooks/useDocumentAnalysis";
import { extractTextFromFile } from "@/utils/documentTextExtraction";
import { DocumentCategory } from "@/types/documents";

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
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  
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

  // Extract text from the file when it changes
  useEffect(() => {
    const processFile = async () => {
      if (!file) {
        setDocumentText(null);
        return;
      }

      setIsExtracting(true);
      try {
        const text = await extractTextFromFile(file);
        setDocumentText(text);
      } catch (err) {
        console.error("Error extracting text:", err);
        toast({
          title: t("textExtractionError"),
          description: t("couldNotExtractText"),
          variant: "destructive",
        });
      } finally {
        setIsExtracting(false);
      }
    };

    processFile();
  }, [file, toast, t]);

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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="classify" className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              {t("classify")}
            </TabsTrigger>
            <TabsTrigger value="extract" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("extract")}
            </TabsTrigger>
            <TabsTrigger value="summarize" className="flex items-center gap-2">
              <FileDigit className="h-4 w-4" />
              {t("summarize")}
            </TabsTrigger>
          </TabsList>
          
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
          
          {result?.success && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">{t("analysisResult")}</h4>
              {formatResult(result.analysis)}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
              <h4 className="font-medium mb-2">{t("error")}</h4>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAnalyze}
          disabled={isExtracting || isAnalyzing || !file}
          className="w-full"
        >
          {(isExtracting || isAnalyzing) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isExtracting ? t("extractingText") : t("analyzing")}
            </>
          ) : (
            <>
              {t("analyzeDocument")}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentAnalysisPanel;
