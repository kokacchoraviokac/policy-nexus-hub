
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, CheckCircle, AlertTriangle } from "lucide-react";
import { Policy } from "@/types/policies";

interface CompleteStepProps {
  importedPolicies: Partial<Policy>[];
  invalidPolicies: { policy: Partial<Policy>; errors: string[] }[];
  onGoToWorkflow: () => void;
}

const CompleteStep: React.FC<CompleteStepProps> = ({ 
  importedPolicies,
  invalidPolicies,
  onGoToWorkflow
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6">
      <div className="rounded-full bg-green-100 p-3">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold">{t("importComplete")}</h3>
      
      <div className="flex flex-col w-full max-w-md space-y-4">
        <Alert variant="success" className="border-green-300 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>{t("successful")}</AlertTitle>
          <AlertDescription>
            {importedPolicies.length} {t("policiesImportedSuccessfully")}
          </AlertDescription>
        </Alert>
        
        {invalidPolicies.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("failed")}</AlertTitle>
            <AlertDescription>
              {invalidPolicies.length} {t("policiesFailedToImport")}
            </AlertDescription>
          </Alert>
        )}
        
        <Alert>
          <AlertTitle>{t("importedPoliciesInDraft")}</AlertTitle>
        </Alert>
      </div>
      
      <Button onClick={onGoToWorkflow} className="mt-6">
        {t("goToWorkflow")}
      </Button>
    </div>
  );
};

export default CompleteStep;
