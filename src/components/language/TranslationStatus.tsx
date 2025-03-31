
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateTranslationReport } from "@/utils/translationValidator";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";
import { Language } from "@/contexts/LanguageContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Map language codes to display names and flags
const languageMap: Record<Language, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇬🇧" },
  sr: { name: "Serbian", flag: "🇷🇸" },
  mk: { name: "Macedonian", flag: "🇲🇰" },
  es: { name: "Spanish", flag: "🇪🇸" }
};

const TranslationStatus: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const report = generateTranslationReport();
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  
  // Use the actual missing count for the current language
  const missingCount = report.missingCount[currentLanguage];
  const completionPercentage = report.completionPercentage[currentLanguage];
  
  const languages: Language[] = ["en", "sr", "mk", "es"];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          {t("translationStatus")}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {/* Current language status */}
          <div className="pb-2">
            <div className="flex items-center mb-1">
              <span className="text-sm font-medium flex items-center">
                {languageMap[currentLanguage].flag} {languageMap[currentLanguage].name}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {completionPercentage}% {t("complete")}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">{t("missingTranslations")}</span>
              <span className="text-xs font-semibold">{missingCount}</span>
            </div>
          </div>
          
          <Collapsible
            open={showAllLanguages}
            onOpenChange={setShowAllLanguages}
            className="border-t pt-2"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-7 w-full flex justify-between">
                <span className="text-xs">{showAllLanguages ? "Hide all languages" : "Show all languages"}</span>
                {showAllLanguages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pt-2">
              <div className="space-y-3">
                {languages.filter(lang => lang !== currentLanguage).map(language => (
                  <div key={language} className="pb-1">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium flex items-center">
                        {languageMap[language].flag} {languageMap[language].name}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {report.completionPercentage[language]}% {t("complete")}
                      </span>
                    </div>
                    <Progress value={report.completionPercentage[language]} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{t("missingTranslations")}</span>
                      <span className="text-xs font-semibold">{report.missingCount[language]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationStatus;
