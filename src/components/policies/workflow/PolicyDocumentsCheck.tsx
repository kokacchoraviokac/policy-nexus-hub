
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FileUp, AlertCircle, CheckCircle } from "lucide-react";
import { usePolicyDocuments } from "@/hooks/usePolicyDocuments";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Policy } from "@/types/policies";

interface PolicyDocumentsCheckProps {
  policy: Policy;
  onUploadClick: () => void;
}

const PolicyDocumentsCheck: React.FC<PolicyDocumentsCheckProps> = ({ policy, onUploadClick }) => {
  const { t } = useLanguage();
  const { documents, isLoading, isError } = usePolicyDocuments(policy.id);
  
  const documentCount = documents?.length || 0;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">{t("documentsCheck")}</h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onUploadClick}
          className="flex items-center gap-2"
        >
          <FileUp className="h-4 w-4" />
          {t("uploadDocument")}
        </Button>
      </div>
      
      <div className="border rounded-md p-4 bg-gray-50">
        {isLoading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertDescription>
              {t("errorLoadingDocuments")}
            </AlertDescription>
          </Alert>
        ) : documentCount > 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>{t("documentsAttached", { count: documentCount })}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <span>{t("noDocuments")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyDocumentsCheck;
