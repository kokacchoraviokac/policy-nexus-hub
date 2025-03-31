
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Add a function to count missing translations
const countMissingTranslations = (language: string): number => {
  // This is a placeholder implementation
  // In a real app, this would count actual missing translations
  return language === "en" ? 0 : 5;
}

const TranslationStatus: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  
  // Pass the current language to the countMissingTranslations function
  const missingCount = countMissingTranslations(currentLanguage || "en");
  
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
            <Progress value={missingCount > 0 ? 80 : 100} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("missingTranslations")}</span>
            <span className="text-sm font-semibold">{missingCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationStatus;
