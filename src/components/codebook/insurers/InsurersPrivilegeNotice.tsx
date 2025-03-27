
import React from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InsurersPrivilegeNoticeProps {
  canAddInsurer: boolean;
  canImportExport: boolean;
}

const InsurersPrivilegeNotice: React.FC<InsurersPrivilegeNoticeProps> = ({
  canAddInsurer,
  canImportExport
}) => {
  const { t } = useLanguage();

  if (canAddInsurer || canImportExport) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg mt-4">
      <Info className="h-5 w-5 mr-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{t("noInsurersPrivileges")}</p>
    </div>
  );
};

export default InsurersPrivilegeNotice;
