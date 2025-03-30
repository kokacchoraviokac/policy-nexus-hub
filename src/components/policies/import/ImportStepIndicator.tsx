
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImportStepIndicatorProps {
  activeStep: "instructions" | "upload" | "review" | "importing" | "complete";
}

const ImportStepIndicator: React.FC<ImportStepIndicatorProps> = ({ activeStep }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          activeStep === "instructions" ? "bg-primary text-primary-foreground" : 
          (activeStep === "upload" || activeStep === "review" || activeStep === "importing" || activeStep === "complete") ? 
          "bg-green-100 text-green-700 border border-green-300" : "bg-muted text-muted-foreground"
        }`}>
          1
        </div>
        <span className="text-xs mt-1">{t("instructions")}</span>
      </div>
      <div className="flex-1 h-1 mx-2 bg-muted">
        <div className={`h-full bg-primary ${
          (activeStep === "upload" || activeStep === "review" || activeStep === "importing" || activeStep === "complete") ? "w-full" : "w-0"
        } transition-all duration-300`}></div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          activeStep === "upload" ? "bg-primary text-primary-foreground" : 
          (activeStep === "review" || activeStep === "importing" || activeStep === "complete") ? 
          "bg-green-100 text-green-700 border border-green-300" : "bg-muted text-muted-foreground"
        }`}>
          2
        </div>
        <span className="text-xs mt-1">{t("upload")}</span>
      </div>
      <div className="flex-1 h-1 mx-2 bg-muted">
        <div className={`h-full bg-primary ${
          (activeStep === "review" || activeStep === "importing" || activeStep === "complete") ? "w-full" : "w-0"
        } transition-all duration-300`}></div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          activeStep === "review" ? "bg-primary text-primary-foreground" : 
          (activeStep === "importing" || activeStep === "complete") ? 
          "bg-green-100 text-green-700 border border-green-300" : "bg-muted text-muted-foreground"
        }`}>
          3
        </div>
        <span className="text-xs mt-1">{t("review")}</span>
      </div>
      <div className="flex-1 h-1 mx-2 bg-muted">
        <div className={`h-full bg-primary ${
          (activeStep === "importing" || activeStep === "complete") ? "w-full" : "w-0"
        } transition-all duration-300`}></div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          activeStep === "complete" ? "bg-green-100 text-green-700 border border-green-300" : 
          "bg-muted text-muted-foreground"
        }`}>
          4
        </div>
        <span className="text-xs mt-1">{t("complete")}</span>
      </div>
    </div>
  );
};

export default ImportStepIndicator;
