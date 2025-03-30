
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyImportInstructionsProps {
  onContinue?: () => void;
}

const PolicyImportInstructions: React.FC<PolicyImportInstructionsProps> = ({ onContinue }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Alert variant="default">
        <Info className="h-4 w-4" />
        <AlertTitle>{t("importInstructions")}</AlertTitle>
        <AlertDescription>
          {t("policyImportDescription")}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("requiredFields")}</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>policy_number</strong> - {t("policyNumberDescription")}</li>
          <li><strong>insurer_name</strong> - {t("insurerNameDescription")}</li>
          <li><strong>policyholder_name</strong> - {t("policyholderNameDescription")}</li>
          <li><strong>start_date</strong> - {t("startDateDescription")} (YYYY-MM-DD)</li>
          <li><strong>expiry_date</strong> - {t("expiryDateDescription")} (YYYY-MM-DD)</li>
          <li><strong>premium</strong> - {t("premiumDescription")}</li>
          <li><strong>currency</strong> - {t("currencyDescription")}</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("optionalFields")}</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>insured_name</strong> - {t("insuredNameDescription")}</li>
          <li><strong>insurance_type</strong> - {t("insuranceTypeDescription")}</li>
          <li><strong>product</strong> - {t("productDescription")}</li>
          <li><strong>notes</strong> - {t("notesDescription")}</li>
        </ul>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("importWarning")}</AlertTitle>
        <AlertDescription>
          {t("policyImportWarningDescription")}
        </AlertDescription>
      </Alert>

      {onContinue && (
        <div className="flex justify-end">
          <Button onClick={onContinue}>{t("continue")}</Button>
        </div>
      )}
    </div>
  );
};

export default PolicyImportInstructions;
