
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

interface ImportingStepProps {
  importProgress: number;
}

const ImportingStep: React.FC<ImportingStepProps> = ({ importProgress }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <h3 className="text-lg font-semibold">{t("importingPolicies")}</h3>
      <p className="text-sm text-muted-foreground">{t("pleaseDoNotCloseThisWindow")}</p>
      <Progress value={importProgress} className="w-full max-w-md mt-4" />
      <p className="text-sm text-muted-foreground">{importProgress}%</p>
    </div>
  );
};

export default ImportingStep;
