
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import ImportExportButtons from "@/components/codebook/ImportExportButtons";
import { Insurer } from "@/types/codebook";

interface InsurersHeaderProps {
  onAddInsurer: () => void;
  canAddInsurer: boolean;
  canImportExport: boolean;
  getExportData: () => any[];
}

const InsurersHeader: React.FC<InsurersHeaderProps> = ({
  onAddInsurer,
  canAddInsurer,
  canImportExport,
  getExportData
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("insuranceCompanies")}</h2>
        <p className="text-muted-foreground">
          {t("insuranceCompaniesDescription")}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {canImportExport && (
          <ImportExportButtons
            getData={getExportData}
            entityName={t('insuranceCompanies')}
          />
        )}
        
        {canAddInsurer && (
          <Button onClick={onAddInsurer}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("addInsurer")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InsurersHeader;
