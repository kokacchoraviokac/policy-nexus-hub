
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useLeadScoring } from "@/hooks/sales/useLeadScoring";

interface LeadScoreIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const LeadScoreIndicator: React.FC<LeadScoreIndicatorProps> = ({ 
  score, 
  size = 'md',
  showTooltip = true
}) => {
  const { t } = useLanguage();
  const { getQualificationLevel } = useLeadScoring();
  
  const qualificationInfo = getQualificationLevel(score);
  
  // Size-based styling
  const sizingClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };
  
  const scoreDisplay = (
    <div className="flex flex-col items-center">
      <div 
        className={`rounded-full ${sizingClasses[size]} ${qualificationInfo.color} text-white flex items-center justify-center font-medium`}
      >
        {score}
      </div>
      {size !== 'sm' && (
        <span className="text-xs text-muted-foreground mt-1">{t(qualificationInfo.level)}</span>
      )}
    </div>
  );
  
  if (!showTooltip) {
    return scoreDisplay;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {scoreDisplay}
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2 p-1">
            <p className="font-medium">{t("leadScore")}: {score}/100</p>
            <p className="text-xs">{t("qualificationLevel")}: {t(qualificationInfo.level)}</p>
            <div className="w-full">
              <Progress value={score} className="h-2" />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LeadScoreIndicator;
