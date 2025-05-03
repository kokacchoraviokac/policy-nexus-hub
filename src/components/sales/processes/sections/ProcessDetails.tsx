
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { SalesProcess } from "@/types/sales/salesProcesses";

interface ProcessDetailsProps {
  process: SalesProcess;
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({ process }) => {
  const { t } = useLanguage();

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground">{t("processDetails")}</h4>
      <div className="mt-1 space-y-2">
        <p className="text-sm">
          <span className="font-medium">{t("createdAt")}: </span>
          {format(new Date(process.created_at), "PPP")}
        </p>
        {process.expected_close_date && (
          <p className="text-sm">
            <span className="font-medium">{t("expectedCloseDate")}: </span>
            {format(new Date(process.expected_close_date), "PPP")}
          </p>
        )}
        <p className="text-sm">
          <span className="font-medium">{t("responsiblePerson")}: </span>
          {process.assigned_to || t("notAssigned")}
        </p>
        <p className="text-sm">
          <span className="font-medium">{t("status")}: </span>
          <Badge 
            variant={process.status === "active" ? "default" : process.status === "completed" ? "secondary" : "destructive"}
            className={process.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs" : "text-xs"}
          >
            {t(process.status)}
          </Badge>
        </p>
      </div>
    </div>
  );
};

export default ProcessDetails;
