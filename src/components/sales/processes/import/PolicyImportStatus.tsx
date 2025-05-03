
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { SalesProcess } from "@/types/sales/salesProcesses";

interface PolicyImportStatusProps {
  process: SalesProcess;
}

const PolicyImportStatus: React.FC<PolicyImportStatusProps> = ({ process }) => {
  const { t } = useLanguage();
  const isReadyForImport = process.stage === "concluded" && process.status === "completed";

  return (
    <>
      {isReadyForImport ? (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">{t("readyForImport")}</AlertTitle>
          <AlertDescription className="text-green-600">
            {t("salesProcessReadyForPolicyImport")}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t("notReadyForImport")}</AlertTitle>
          <AlertDescription>
            {process.stage !== "concluded" 
              ? t("salesProcessMustBeConcluded") 
              : t("salesProcessMustBeCompleted")}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default PolicyImportStatus;
