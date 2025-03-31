
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateTranslationReport } from "@/utils/translationValidator";

const TranslationStatus: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const report = generateTranslationReport();
  
  // Use the actual missing count for the current language
  const missingCount = report.missingCount[currentLanguage];
  const completionPercentage = report.completionPercentage[currentLanguage];
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">{t("translationStatus")}</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{t("translationComplete")}</span>
              <span className="text-sm text-muted-foreground">
                {missingCount > 0 ? t("incomplete") : t("complete")}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("missingTranslations")}</span>
            <span className="text-sm font-semibold">{missingCount}</span>
          </div>
          
          <div className="text-xs text-muted-foreground text-right">
            {completionPercentage}% {t("complete")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationStatus;
