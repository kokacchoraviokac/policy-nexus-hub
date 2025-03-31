
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ClipboardList } from "lucide-react";
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
  const hasErrors = invalidPolicies.length > 0;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium">{t("importComplete")}</h3>
            <p className="text-muted-foreground">
              {importedPolicies.length} {t("policiesImportedSuccessfully")}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">{t("successful")}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{importedPolicies.length}</p>
            </div>
            
            {hasErrors && (
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">{t("failed")}</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{invalidPolicies.length}</p>
              </div>
            )}
          </div>
          
          {hasErrors && (
            <Card className="w-full max-w-md bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-medium text-amber-800">{t("importErrors")}</h4>
                    <ul className="mt-2 text-sm text-amber-700 space-y-1">
                      {invalidPolicies.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            {item.policy.policy_number || `Row ${index + 1}`}
                          </Badge>
                          <span>{item.errors[0]}</span>
                        </li>
                      ))}
                      {invalidPolicies.length > 3 && (
                        <li className="text-sm italic">
                          {t("andMoreErrors", { count: invalidPolicies.length - 3 })}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="bg-blue-50 w-full max-w-md border border-blue-200 rounded-md p-4 flex items-start gap-2">
            <ClipboardList className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700 text-left">
              {t("importedPoliciesInDraft")}
            </p>
          </div>
          
          <Button onClick={onGoToWorkflow} className="mt-6">
            {t("goToWorkflow")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompleteStep;
