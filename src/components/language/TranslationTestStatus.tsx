
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CircleAlert } from "lucide-react";

// Mock function for translation test components until real implementation is added
const getMissingTranslationsCount = () => 0;

const TranslationTestStatus: React.FC = () => {
  const { currentLanguage } = useLanguage();
  
  // Use the mock function until real implementation is added
  const missingCount = getMissingTranslationsCount();
  
  if (missingCount === 0) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-4">
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>Translation Issues Detected</AlertTitle>
      <AlertDescription className="flex items-center">
        <span>
          There are <Badge variant="outline">{missingCount}</Badge> missing translations for {currentLanguage}.
        </span>
      </AlertDescription>
    </Alert>
  );
};

export default TranslationTestStatus;
