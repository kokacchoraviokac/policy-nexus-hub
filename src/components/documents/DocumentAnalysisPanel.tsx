
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Tag, AlertCircle, FileText } from "lucide-react";
import { DocumentAnalysisPanelProps, DocumentCategory } from "@/types/documents";

const DocumentAnalysisPanel: React.FC<DocumentAnalysisPanelProps> = ({
  document,
  file,
  onAnalysisComplete,
  onCategoryDetected
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate document analysis
  useEffect(() => {
    if (file) {
      setAnalyzing(true);
      setError(null);
      
      // Mock analysis process
      const timer = setTimeout(() => {
        setAnalyzing(false);
        setCompleted(true);
        
        // Mock detection result based on file type
        let detectedCategories: string[] = [];
        
        if (file.type.includes('pdf')) {
          detectedCategories = ['policy', 'invoice'];
        } else if (file.type.includes('image')) {
          detectedCategories = ['identification', 'other'];
        } else if (file.type.includes('word')) {
          detectedCategories = ['contract', 'amendment'];
        }
        
        setCategories(detectedCategories);
        
        // Notify parent about detected category
        if (detectedCategories.length > 0 && onCategoryDetected) {
          onCategoryDetected(detectedCategories[0] as DocumentCategory);
        }
        
        if (onAnalysisComplete) {
          onAnalysisComplete();
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [file, onCategoryDetected, onAnalysisComplete]);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="mr-2 h-4 w-4" />
          Document Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {file ? (
          <>
            <div className="text-sm mb-4">
              <div className="font-medium">File:</div>
              <div className="flex items-center text-muted-foreground">
                <FileText className="h-4 w-4 mr-1" />
                {file.name}
              </div>
            </div>
            
            {analyzing ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-pulse flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                  <p>Analyzing document...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center text-destructive py-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            ) : completed ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">
                    <Tag className="h-4 w-4 inline mr-1" />
                    Detected Categories:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Badge 
                          key={category} 
                          variant="outline" 
                          className="bg-blue-50"
                        >
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No categories detected</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-sm text-muted-foreground py-4 text-center">
            Upload a document to start analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysisPanel;
