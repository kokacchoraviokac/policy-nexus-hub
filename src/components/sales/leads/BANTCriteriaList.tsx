
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  BadgeDollarSign, 
  UserCheck, 
  Target, 
  Clock 
} from "lucide-react";

interface BANTCriteriaListProps {
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

const BANTCriteriaList: React.FC<BANTCriteriaListProps> = ({ 
  orientation = "vertical",
  size = "md"
}) => {
  const { t } = useLanguage();
  
  // Size-based styling
  const sizeClasses = {
    sm: {
      icon: "h-4 w-4",
      text: "text-xs",
      spacing: "space-y-1"
    },
    md: {
      icon: "h-5 w-5",
      text: "text-sm",
      spacing: "space-y-2"
    },
    lg: {
      icon: "h-6 w-6",
      text: "text-base",
      spacing: "space-y-3"
    }
  };
  
  // Orientation-based styling
  const containerClasses = orientation === "horizontal" 
    ? "flex flex-row justify-between gap-4" 
    : `flex flex-col ${sizeClasses[size].spacing}`;
  
  const criteriaItems = [
    {
      letter: "B",
      label: "budgetCriteria",
      description: "budgetCriteriaDescription",
      icon: <BadgeDollarSign className={`${sizeClasses[size].icon} text-green-500`} />,
    },
    {
      letter: "A",
      label: "authorityCriteria",
      description: "authorityCriteriaDescription",
      icon: <UserCheck className={`${sizeClasses[size].icon} text-blue-500`} />,
    },
    {
      letter: "N",
      label: "needCriteria",
      description: "needCriteriaDescription",
      icon: <Target className={`${sizeClasses[size].icon} text-purple-500`} />,
    },
    {
      letter: "T",
      label: "timelineCriteria",
      description: "timelineCriteriaDescription",
      icon: <Clock className={`${sizeClasses[size].icon} text-amber-500`} />,
    },
  ];

  return (
    <div className={containerClasses}>
      {criteriaItems.map((item) => (
        <div key={item.letter} className="flex items-start gap-2">
          <div className="shrink-0">{item.icon}</div>
          <div>
            <h4 className={`font-medium ${sizeClasses[size].text}`}>
              {item.letter}: {t(item.label)}
            </h4>
            {size !== "sm" && (
              <p className={`${sizeClasses[size].text} text-muted-foreground`}>
                {t(item.description)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BANTCriteriaList;
