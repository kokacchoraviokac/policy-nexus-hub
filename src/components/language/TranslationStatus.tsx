
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Add a function to count missing translations if it doesn't exist
const countMissingTranslations = (language: string): number => {
  // This is a placeholder implementation
  // In a real app, this would count actual missing translations
  return language === "en" ? 0 : 10;  // Just a placeholder value
}

const TranslationStatus: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  
  // Use the countMissingTranslations function with the current language
  const missingCount = countMissingTranslations(currentLanguage);
  
  // Calculate completion percentage (placeholder implementation)
  const totalCount = 100; // Placeholder for total translation entries
  const completedCount = totalCount - missingCount;
  const completionPercentage = (completedCount / totalCount) * 100;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">{t("translationStatus")}</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{t("completionStatus")}</span>
              <span className="text-sm text-muted-foreground">{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm font-medium">{t("missingTranslations")}</p>
              <p className="text-2xl font-bold mt-1">{missingCount}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm font-medium">{t("totalTranslations")}</p>
              <p className="text-2xl font-bold mt-1">{totalCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationStatus;
