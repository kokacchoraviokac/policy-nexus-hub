
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Add a function to count missing translations if it doesn't exist
const countMissingTranslations = (language: string): number => {
  // This is a placeholder implementation
  // In a real app, this would count actual missing translations
  return language === "en" ? 0 : 5;
}

const TranslationTestStatus: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  
  // Use the countMissingTranslations function with the current language
  const missingCount = countMissingTranslations(currentLanguage);
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">{t("translationTestStatus")}</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{t("testStatus")}</span>
            <span className="text-sm text-muted-foreground">
              {missingCount > 0 
                ? t("testFailed") 
                : t("testPassed")}
            </span>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-md text-center">
            <p className="text-sm font-medium">{t("failedTests")}</p>
            <p className="text-2xl font-bold mt-1">{missingCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationTestStatus;
