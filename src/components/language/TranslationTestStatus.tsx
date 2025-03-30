
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateTranslationReport } from '@/utils/translationValidator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TranslationTestStatusProps {
  autoRun?: boolean;
}

const TranslationTestStatus: React.FC<TranslationTestStatusProps> = ({ autoRun }) => {
  const { language, getMissingTranslationsCount } = useLanguage();
  
  // Generate a comprehensive report - only in dev environments
  const report = generateTranslationReport();
  
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          Translation Status
          <Badge variant={language === 'en' ? "default" : "outline"}>
            {language.toUpperCase()}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Development Tool - Not visible in production
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>English (EN)</span>
            <Badge variant="outline" className="bg-green-100">
              {report.completionPercentage.en}% complete
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span>Serbian (SR)</span>
            <Badge variant={report.completionPercentage.sr >= 90 ? "outline" : "secondary"} 
              className={report.completionPercentage.sr >= 90 ? "bg-green-100" : "bg-amber-100"}>
              {report.completionPercentage.sr}% complete
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span>Macedonian (MK)</span>
            <Badge variant={report.completionPercentage.mk >= 90 ? "outline" : "secondary"} 
              className={report.completionPercentage.mk >= 90 ? "bg-green-100" : "bg-amber-100"}>
              {report.completionPercentage.mk}% complete
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span>Spanish (ES)</span>
            <Badge variant={report.completionPercentage.es >= 90 ? "outline" : "secondary"} 
              className={report.completionPercentage.es >= 90 ? "bg-green-100" : "bg-amber-100"}>
              {report.completionPercentage.es}% complete
            </Badge>
          </div>
          
          {language !== 'en' && getMissingTranslationsCount() > 0 && (
            <div className="text-amber-600 pt-1">
              Current language ({language.toUpperCase()}) is missing {getMissingTranslationsCount()} translations
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationTestStatus;
