
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ImportingStepProps {
  importProgress: number;
}

const ImportingStep: React.FC<ImportingStepProps> = ({ importProgress }) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
          
          <div className="space-y-2 w-full max-w-md">
            <h3 className="text-lg font-medium">{t("importingPolicies")}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("pleaseDoNotCloseThisWindow")}
            </p>
            
            <Progress value={importProgress} className="w-full h-2" />
            
            <p className="text-sm text-right text-muted-foreground">
              {importProgress}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportingStep;
