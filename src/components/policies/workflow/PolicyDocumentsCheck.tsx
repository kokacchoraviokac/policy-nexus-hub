
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePolicyDocuments } from "@/hooks/usePolicyDocuments";
import { Button } from "@/components/ui/button";
import { Policy } from "@/types/policies";
import { Loader2, FileCheck, AlertTriangle, FileUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PolicyDocumentsCheckProps {
  policy: Policy;
  onUploadClick: () => void;
}

const PolicyDocumentsCheck: React.FC<PolicyDocumentsCheckProps> = ({ 
  policy,
  onUploadClick
}) => {
  const { t } = useLanguage();
  const { documents, isLoading, documentsCount } = usePolicyDocuments(policy.id);
  
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p className="text-sm text-muted-foreground">{t("loadingDocuments")}</p>
      </div>
    );
  }
  
  // Minimum required documents (policy and invoice)
  const requiredDocumentsCount = 2;
  const hasRequiredDocuments = documentsCount >= requiredDocumentsCount;
  const progressValue = Math.min(100, (documentsCount / requiredDocumentsCount) * 100);
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{t("documentsCheck")}</h3>
      <p className="text-sm text-muted-foreground">{t("requiredDocumentsForPolicy")}</p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {t("documentsAttached", { count: documentsCount })}
          </span>
          <span className="text-sm text-muted-foreground">
            {documentsCount} / {requiredDocumentsCount}
          </span>
        </div>
        <Progress 
          value={progressValue} 
          className={hasRequiredDocuments ? "bg-blue-100" : "bg-amber-100"} 
        />
      </div>
      
      {hasRequiredDocuments ? (
        <div className="flex items-center text-sm text-green-600">
          <FileCheck className="mr-2 h-4 w-4" />
          {t("documentsUploaded")}
        </div>
      ) : (
        <div className="flex items-center text-sm text-amber-600">
          <AlertTriangle className="mr-2 h-4 w-4" />
          {t("missingRequiredDocuments")}
        </div>
      )}
      
      <Button 
        onClick={onUploadClick}
        variant={hasRequiredDocuments ? "outline" : "default"} 
        className="w-full"
      >
        <FileUp className="mr-2 h-4 w-4" />
        {t("uploadDocument")}
      </Button>
    </div>
  );
};

export default PolicyDocumentsCheck;
