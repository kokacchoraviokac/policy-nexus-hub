
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Reports = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("reports")}</h1>
        <p className="text-muted-foreground">
          {t("reportsManagement")}
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-border text-center">
        <p className="text-lg font-medium">{t("analyticsReportingModule")}</p>
        <p className="text-muted-foreground mt-2">{t("analyticsModuleDescription")}</p>
      </div>
    </div>
  );
};

export default Reports;
