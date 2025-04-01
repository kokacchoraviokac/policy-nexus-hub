
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Policy } from "@/types/policies";
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

interface CompleteStepProps {
  importedPolicies: Partial<Policy>[];
  invalidPolicies: any[];
  onGoToWorkflow: () => void;
}

const CompleteStep: React.FC<CompleteStepProps> = ({
  importedPolicies,
  invalidPolicies,
  onGoToWorkflow,
}) => {
  const { t } = useLanguage();
  
  const successCount = importedPolicies.length;
  const failCount = invalidPolicies.length;
  
  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center p-4 text-center space-y-6">
          <div className="rounded-full bg-green-50 p-3">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium">{t("importComplete")}</h3>
            <p className="text-muted-foreground">
              {t("importedPoliciesInDraft")}
            </p>
          </div>
          
          <div className="w-full max-w-md rounded-lg bg-slate-50 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">{t("successful")}</span>
              <span className="font-medium text-green-600">{successCount}</span>
            </div>
            
            {failCount > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("failed")}</span>
                <span className="font-medium text-amber-600">{failCount}</span>
              </div>
            )}
          </div>
          
          {failCount > 0 && (
            <div className="w-full max-w-md rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-medium text-amber-800">{t("importErrors")}</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {invalidPolicies.slice(0, 2).map((item, index) => (
                      <div key={index} className="mb-1">
                        {item.errors && item.errors.length > 0 
                          ? item.errors[0].message || item.errors[0]
                          : t("validationFailed")}
                      </div>
                    ))}
                    {invalidPolicies.length > 2 && (
                      <div className="text-amber-600 mt-1">
                        {t("andMoreErrors", { count: invalidPolicies.length - 2 })}
                      </div>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={onGoToWorkflow} 
            className="mt-6 w-full max-w-md"
            size="lg"
          >
            {t("viewImportedPolicies")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompleteStep;
