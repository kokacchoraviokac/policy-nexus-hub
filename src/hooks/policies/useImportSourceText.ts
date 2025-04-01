
import { useLanguage } from "@/contexts/LanguageContext";

export interface ImportSourceText {
  title: string;
  description: string;
  alertTitle?: string;
  alertDescription?: string;
}

export const useImportSourceText = (salesProcessData: any | null): ImportSourceText => {
  const { t } = useLanguage();
  
  if (salesProcessData) {
    return {
      title: t("importPolicyFromSalesProcess"),
      description: t("importPolicyFromSalesProcessDescription"),
      alertTitle: t("importingFromSalesProcess"),
      alertDescription: t("policyDataPreparedFromSalesProcess")
    };
  } else {
    return {
      title: t("importPolicies"),
      description: t("importPoliciesFromInsuranceCompanies")
    };
  }
};
