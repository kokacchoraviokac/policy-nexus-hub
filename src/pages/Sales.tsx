
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Sales = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("sales")}</h1>
        <p className="text-muted-foreground">
          {t("salesManagement")}
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-border text-center">
        <p className="text-lg font-medium">{t("salesLeadModule")}</p>
        <p className="text-muted-foreground mt-2">{t("salesModuleDescription")}</p>
      </div>
    </div>
  );
};

export default Sales;
