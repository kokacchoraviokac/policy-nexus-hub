
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, FileUp, FileSearch, Loader2, CheckCircle } from "lucide-react";

interface ImportStepIndicatorProps {
  activeStep: "instructions" | "upload" | "review" | "importing" | "complete";
}

const ImportStepIndicator: React.FC<ImportStepIndicatorProps> = ({ activeStep }) => {
  const { t } = useLanguage();
  
  const steps = [
    { id: "instructions", label: t("importInstructions"), icon: FileText },
    { id: "upload", label: t("upload"), icon: FileUp },
    { id: "review", label: t("review"), icon: FileSearch },
    { id: "importing", label: t("importing"), icon: Loader2 },
    { id: "complete", label: t("done"), icon: CheckCircle }
  ];
  
  const getStepStatus = (step: string) => {
    const stepIndex = steps.findIndex(s => s.id === step);
    const activeIndex = steps.findIndex(s => s.id === activeStep);
    
    if (stepIndex < activeIndex) return "complete";
    if (stepIndex === activeIndex) return "active";
    return "upcoming";
  };
  
  return (
    <div className="flex justify-center my-6">
      <div className="flex items-center space-x-0">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${status === "active" 
                      ? "border-primary bg-primary text-white" 
                      : status === "complete" 
                        ? "border-green-500 bg-green-500 text-white" 
                        : "border-gray-300 text-gray-400"
                    }`}
                >
                  {status === "active" && step.id === "importing" ? (
                    <Icon className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span 
                  className={`text-xs mt-2 hidden sm:block
                    ${status === "active" 
                      ? "text-primary font-medium" 
                      : status === "complete" 
                        ? "text-green-600" 
                        : "text-gray-500"
                    }`}
                >
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={`w-10 h-0.5 
                    ${index < steps.findIndex(s => s.id === activeStep) 
                      ? "bg-green-500" 
                      : "bg-gray-300"
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ImportStepIndicator;
