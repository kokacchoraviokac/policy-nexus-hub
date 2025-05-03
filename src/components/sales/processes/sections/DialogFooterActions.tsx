
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { SalesProcess } from "@/types/sales/salesProcesses";

interface DialogFooterActionsProps {
  process: SalesProcess;
  onClose: () => void;
  onImportPolicy: () => void;
}

const DialogFooterActions: React.FC<DialogFooterActionsProps> = ({
  process,
  onClose,
  onImportPolicy
}) => {
  const { t } = useLanguage();
  const isReadyForPolicyImport = process.stage === "concluded" && process.status === "completed";

  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={onClose}
        >
          {t("close")}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
        >
          {t("moveToNextStage")}
        </Button>
      </div>
      <div className="flex gap-2">
        {isReadyForPolicyImport && (
          <Button 
            variant="default" 
            size="sm"
            className="gap-1"
            onClick={onImportPolicy}
          >
            <FileUp className="h-4 w-4" />
            {t("importPolicy")}
          </Button>
        )}
        <Button variant="default" size="sm">
          {t("editProcess")}
        </Button>
      </div>
    </div>
  );
};

export default DialogFooterActions;
