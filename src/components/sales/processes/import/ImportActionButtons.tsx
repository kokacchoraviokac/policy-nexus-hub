
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { SalesProcess } from "@/types/sales/salesProcesses";

interface ImportActionButtonsProps {
  process: SalesProcess;
  isImporting: boolean;
  onCancel: () => void;
  onImport: () => void;
}

const ImportActionButtons: React.FC<ImportActionButtonsProps> = ({ 
  process,
  isImporting,
  onCancel,
  onImport
}) => {
  const { t } = useLanguage();
  const isReadyForImport = process.stage === "concluded" && process.status === "completed";

  return (
    <>
      <Button variant="outline" onClick={onCancel}>
        {t("cancel")}
      </Button>
      <Button 
        onClick={onImport} 
        disabled={!isReadyForImport || isImporting}
        className="gap-2"
      >
        {isImporting ? (
          <>{t("preparing")}...</>
        ) : (
          <>
            <FileUp className="h-4 w-4" />
            {t("importPolicy")}
          </>
        )}
      </Button>
    </>
  );
};

export default ImportActionButtons;
