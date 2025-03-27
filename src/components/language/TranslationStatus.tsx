
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { generateTranslationReport } from '@/utils/translationValidator';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslationStatusProps {
  showDetails?: boolean;
}

const TranslationStatus: React.FC<TranslationStatusProps> = ({ showDetails = false }) => {
  // Only render in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const { language, getMissingTranslationsCount } = useLanguage();
  const missingCount = getMissingTranslationsCount();

  // Only display if there are missing translations
  if (missingCount === 0 && !showDetails) {
    return null;
  }

  // Generate full report if showing details
  const handleShowFullReport = () => {
    const report = generateTranslationReport();
    console.table({
      'Total Keys': report.totalKeys,
      'English': `100% (${report.totalKeys} keys)`,
      'Serbian': `${report.completionPercentage.sr}% (${report.totalKeys - report.missingCount.sr}/${report.totalKeys} keys)`,
      'Macedonian': `${report.completionPercentage.mk}% (${report.totalKeys - report.missingCount.mk}/${report.totalKeys} keys)`,
      'Spanish': `${report.completionPercentage.es}% (${report.totalKeys - report.missingCount.es}/${report.totalKeys} keys)`
    });
    
    // Log missing keys for current language
    if (language !== 'en' && report.missingKeys[language].length > 0) {
      console.group(`Missing translations for ${language.toUpperCase()}`);
      console.table(report.missingKeys[language]);
      console.groupEnd();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Badge variant="outline" className="cursor-help bg-yellow-50 text-yellow-800 border-yellow-300">
              {missingCount} missing translations
            </Badge>
            {showDetails && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-6 text-xs"
                onClick={handleShowFullReport}
              >
                Show Report
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Current language: {language.toUpperCase()}</p>
          <p>{missingCount} keys are missing translations</p>
          <p className="text-xs mt-1">Open console and click "Show Report" for details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TranslationStatus;
