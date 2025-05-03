
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/types/sales/salesProcesses";

interface ProcessDetailsSummaryProps {
  process: SalesProcess;
}

const ProcessDetailsSummary: React.FC<ProcessDetailsSummaryProps> = ({ process }) => {
  const { t } = useLanguage();

  return (
    <div className="rounded-md border p-4 bg-muted/50">
      <h3 className="text-sm font-medium mb-2">{t("salesProcessDetails")}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="font-medium">{t("processTitle")}:</span> {process.title}</div>
        <div><span className="font-medium">{t("clientName")}:</span> {process.client_name}</div>
        <div><span className="font-medium">{t("stage")}:</span> {t(process.stage)}</div>
        <div><span className="font-medium">{t("status")}:</span> {t(process.status)}</div>
        <div><span className="font-medium">{t("insuranceType")}:</span> {t(process.insurance_type)}</div>
        {process.estimated_value && (
          <div><span className="font-medium">{t("estimatedValue")}:</span> {process.estimated_value}</div>
        )}
      </div>
    </div>
  );
};

export default ProcessDetailsSummary;
