
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import InsuranceTypeBadge from "../badges/InsuranceTypeBadge";
import { SalesProcess } from "@/types/sales/salesProcesses";

interface ClientInformationProps {
  process: SalesProcess;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ process }) => {
  const { t } = useLanguage();

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground">{t("clientInformation")}</h4>
      <div className="mt-1 space-y-2">
        <p className="text-sm">
          <span className="font-medium">{t("clientName")}: </span>
          {process.client_name}
        </p>
        <p className="text-sm">
          <span className="font-medium">{t("insuranceType")}: </span>
          <InsuranceTypeBadge type={process.insurance_type} />
        </p>
        {process.estimated_value && (
          <p className="text-sm">
            <span className="font-medium">{t("estimatedValue")}: </span>
            {process.estimated_value}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClientInformation;
