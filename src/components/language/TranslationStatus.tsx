
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { generateTranslationReport } from '@/utils/translationValidator';
import { runTranslationTests } from '@/utils/testing/translationTester';
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
  
  const handleRunTests = () => {
    runTranslationTests();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Badge 
              variant="outline" 
              className={`cursor-help ${
                missingCount > 0 
                  ? "bg-yellow-50 text-yellow-800 border-yellow-300" 
                  : "bg-green-50 text-green-800 border-green-300"
              }`}
            >
              {missingCount > 0 
                ? `${missingCount} missing translations` 
                : "All translations complete"}
            </Badge>
            {showDetails && (
              <div className="flex ml-2 space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={handleShowFullReport}
                >
                  Show Report
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={handleRunTests}
                >
                  Run Tests
                </Button>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Current language: {language.toUpperCase()}</p>
          {missingCount > 0 ? (
            <p>{missingCount} keys are missing translations</p>
          ) : (
            <p>All translations are complete!</p>
          )}
          <p className="text-xs mt-1">
            {showDetails 
              ? "Click 'Show Report' for details or 'Run Tests' for validation" 
              : "Open console and click 'Show Report' for details"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TranslationStatus;
