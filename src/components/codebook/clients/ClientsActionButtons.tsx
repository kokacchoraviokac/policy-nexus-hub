
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ImportExportButtons from "@/components/codebook/ImportExportButtons";
import { Client } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClientsActionButtonsProps {
  onImport: (importedClients: Partial<Client>[]) => Promise<void>;
  getExportData: () => any[];
  onAddClient: () => void;
}

const ClientsActionButtons: React.FC<ClientsActionButtonsProps> = ({
  onImport,
  getExportData,
  onAddClient
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <ImportExportButtons
        onImport={onImport}
        getData={getExportData}
        entityName={t("clients")}
      />
      <Button className="flex items-center gap-1" onClick={onAddClient}>
        <Plus className="h-4 w-4" /> {t("addClient")}
      </Button>
    </div>
  );
};

export default ClientsActionButtons;
