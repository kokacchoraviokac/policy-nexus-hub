
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePolicyDocuments } from "@/hooks/usePolicyDocuments";
import { Policy } from "@/types/policies";
import { FileText, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  
  const requiredDocumentTypes = [
    { type: 'policy', label: t('policyDocument') },
    { type: 'invoice', label: t('invoiceDocument') }
  ];
  
  const hasRequiredDocuments = () => {
    if (!documents || documents.length === 0) return false;
    
    // Check if at least one document of each required type exists
    return requiredDocumentTypes.every(reqType => 
      documents.some(doc => doc.document_type === reqType.type)
    );
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{t("policyDocuments")}</h3>
      <p className="text-sm text-muted-foreground">{t("requiredDocumentsForPolicy")}</p>
      
      {isLoading ? (
        <p className="text-sm text-muted-foreground animate-pulse">{t("loadingDocuments")}...</p>
      ) : (
        <>
          {documentsCount > 0 ? (
            <div className="space-y-2">
              <p className="text-sm">
                {t("documentsUploaded")}: <span className="font-medium">{documentsCount}</span>
              </p>
              
              {!hasRequiredDocuments() && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-sm ml-2">
                    {t("missingRequiredDocuments")}
                  </AlertDescription>
                </Alert>
              )}
              
              <ul className="space-y-1 mt-2">
                {requiredDocumentTypes.map(docType => {
                  const hasDoc = documents?.some(doc => doc.document_type === docType.type);
                  return (
                    <li key={docType.type} className="flex items-center text-sm">
                      {hasDoc ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-amber-500">○</span>
                      )}
                      <span className="ml-2">{docType.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm ml-2">
                {t("noDocumentsUploaded")}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={onUploadClick}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("uploadDocument")}
          </Button>
        </>
      )}
    </div>
  );
};

export default PolicyDocumentsCheck;
