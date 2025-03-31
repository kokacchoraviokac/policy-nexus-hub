
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ImportExportButtons from "@/components/codebook/ImportExportButtons";
import { Insurer } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface InsurersActionButtonsProps {
  onImport: (importedInsurers: Partial<Insurer>[]) => Promise<{ created: number, updated: number }>;
  getExportData: () => any[];
  onAddInsurer: () => void;
}

const InsurersActionButtons: React.FC<InsurersActionButtonsProps> = ({
  onImport,
  getExportData,
  onAddInsurer
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { hasPrivilege, user } = useAuth();
  
  // Log the role and privilege check results for debugging
  console.log("Current user role:", user?.role);
  const canAddInsurer = hasPrivilege('codebook.insurers.create');
  const canImportExport = hasPrivilege('codebook.insurers.import') || hasPrivilege('codebook.insurers.export');
  
  console.log("Can add insurer:", canAddInsurer);
  console.log("Can import/export:", canImportExport);

  const handleImport = async (importedInsurers: Partial<Insurer>[]) => {
    try {
      console.log("Importing insurers:", importedInsurers);
      const { created, updated } = await onImport(importedInsurers);
      
      toast({
        title: t("importCompleted"),
        description: t("createdNewInsurers").replace("{0}", created.toString()).replace("{1}", updated.toString()),
      });
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: t("importFailed"),
        description: t("importFailedDescription"),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {canImportExport && (
        <ImportExportButtons
          onImport={handleImport}
          getData={getExportData}
          entityName={t("insuranceCompanies")}
        />
      )}
      
      {canAddInsurer && (
        <Button className="flex items-center gap-1" onClick={onAddInsurer}>
          <Plus className="h-4 w-4" /> {t("addInsurer")}
        </Button>
      )}
    </div>
  );
};

export default InsurersActionButtons;
