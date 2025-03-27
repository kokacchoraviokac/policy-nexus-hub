
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ImportExportButtons from "@/components/codebook/ImportExportButtons";
import { Insurer } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";

interface InsurersActionButtonsProps {
  onImport: (importedInsurers: Partial<Insurer>[]) => Promise<void>;
  getExportData: () => any[];
  onAddInsurer: () => void;
}

const InsurersActionButtons: React.FC<InsurersActionButtonsProps> = ({
  onImport,
  getExportData,
  onAddInsurer
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <ImportExportButtons
        onImport={onImport}
        getData={getExportData}
        entityName={t("insuranceCompanies")}
      />
      <Button className="flex items-center gap-1" onClick={onAddInsurer}>
        <Plus className="h-4 w-4" /> {t("addInsurer")}
      </Button>
    </div>
  );
};

export default InsurersActionButtons;
