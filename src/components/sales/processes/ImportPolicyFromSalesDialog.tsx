
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/types/sales/salesProcesses";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import the new modularized components
import PolicyImportStatus from "./import/PolicyImportStatus";
import ProcessDetailsSummary from "./import/ProcessDetailsSummary";
import ImportActionButtons from "./import/ImportActionButtons";

interface ImportPolicyFromSalesDialogProps {
  process: SalesProcess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportPolicyFromSalesDialog: React.FC<ImportPolicyFromSalesDialogProps> = ({
  process,
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);

  const handlePolicyImport = async () => {
    try {
      setIsImporting(true);
      
      console.log("Preparing policy import from sales process:", process.id);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t("salesProcessReadyForImport"), {
        description: t("redirectingToPolicyImport"),
      });
      
      onOpenChange(false);
      
      navigate(`/policies/import?from_sales=${process.id}`);
      
    } catch (error) {
      console.error("Error preparing policy import:", error);
      toast.error(t("errorPreparingImport"), {
        description: t("tryAgainLater"),
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("importPolicyFromSales")}</DialogTitle>
          <DialogDescription>
            {t("importPolicyFromSalesDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <PolicyImportStatus process={process} />
          <ProcessDetailsSummary process={process} />
        </div>
        
        <DialogFooter>
          <ImportActionButtons 
            process={process}
            isImporting={isImporting}
            onCancel={() => onOpenChange(false)}
            onImport={handlePolicyImport}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportPolicyFromSalesDialog;
