
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FileUp, ChevronRight } from "lucide-react";
import { SalesProcess } from "@/types/salesProcess";
import { getNextStage } from "@/utils/sales/stageTransitionConfig";

interface SalesProcessDialogFooterProps {
  process: SalesProcess;
  onClose: () => void;
  onMoveToNextStage: () => void;
  isReadyForPolicyImport: boolean;
  onImportPolicy: () => void;
}

const SalesProcessDialogFooter: React.FC<SalesProcessDialogFooterProps> = ({
  process,
  onClose,
  onMoveToNextStage,
  isReadyForPolicyImport,
  onImportPolicy
}) => {
  const { t } = useLanguage();
  
  // Determine if the process can move to the next stage
  const hasNextStage = !!getNextStage(process.stage);
  
  return (
    <DialogFooter className="flex justify-between items-center">
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={onClose}
        >
          {t("close")}
        </Button>
        {hasNextStage && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onMoveToNextStage}
          >
            <ChevronRight className="h-4 w-4 mr-1.5" />
            {t("moveToNextStage")}
          </Button>
        )}
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
    </DialogFooter>
  );
};

export default SalesProcessDialogFooter;
