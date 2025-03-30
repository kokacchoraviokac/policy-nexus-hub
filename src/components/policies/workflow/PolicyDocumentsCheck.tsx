
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Loader2, FileX, CheckCircle } from "lucide-react";
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
  
  const { data, isLoading } = useQuery({
    queryKey: ['policy-documents', policy.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_documents')
        .select('*')
        .eq('policy_id', policy.id);
      
      if (error) throw error;
      return data || [];
    }
  });
  
  const documentsCount = data?.length || 0;
  const hasRequiredDocuments = documentsCount > 0;
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{t("policyDocuments")}</h3>
      <p className="text-sm text-muted-foreground">{t("requiredDocumentsForPolicy")}</p>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">{t("loadingDocuments")}</span>
        </div>
      ) : documentsCount > 0 ? (
        <>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm ml-2">
              {t("documentsUploaded")}: {documentsCount}
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data?.slice(0, 4).map((doc) => (
              <div key={doc.id} className="border rounded p-3 bg-white flex items-start space-x-3">
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                  <p className="font-medium text-sm truncate">{doc.document_name}</p>
                  <p className="text-xs text-muted-foreground">{t(doc.document_type)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {documentsCount > 4 && (
            <p className="text-sm text-muted-foreground text-center">
              +{documentsCount - 4} {t("moreDocuments")}
            </p>
          )}
        </>
      ) : (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200">
          <FileX className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm ml-2">
            {t("noDocumentsUploaded")}
          </AlertDescription>
        </Alert>
      )}
      
      <Button className="w-full" onClick={onUploadClick}>
        <Plus className="mr-2 h-4 w-4" />
        {t("uploadDocument")}
      </Button>
    </div>
  );
};

export default PolicyDocumentsCheck;
