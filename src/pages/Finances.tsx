
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Finances = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("finances")}</h1>
        <p className="text-muted-foreground">
          {t("financesManagement")}
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-border text-center">
        <p className="text-lg font-medium">{t("financialOperationsModule")}</p>
        <p className="text-muted-foreground mt-2">{t("financialModuleDescription")}</p>
      </div>
    </div>
  );
};

export default Finances;
