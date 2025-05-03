
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/types/sales/salesProcesses";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, FileUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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

  const isReadyForImport = process.stage === "concluded" && process.status === "completed";

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
          {isReadyForImport ? (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">{t("readyForImport")}</AlertTitle>
              <AlertDescription className="text-green-600">
                {t("salesProcessReadyForPolicyImport")}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t("notReadyForImport")}</AlertTitle>
              <AlertDescription>
                {process.stage !== "concluded" 
                  ? t("salesProcessMustBeConcluded") 
                  : t("salesProcessMustBeCompleted")}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="rounded-md border p-4 bg-muted/50">
            <h3 className="text-sm font-medium mb-2">{t("salesProcessDetails")}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">{t("processTitle")}:</span> {process.title}</div>
              <div><span className="font-medium">{t("clientName")}:</span> {process.client_name}</div>
              <div><span className="font-medium">{t("stage")}:</span> {t(process.stage)}</div>
              <div><span className="font-medium">{t("status")}:</span> {t(process.status)}</div>
              <div><span className="font-medium">{t("insuranceType")}:</span> {t(process.insurance_type)}</div>
              {process.estimated_value && (
                <div><span className="font-medium">{t("estimatedValue")}:</span> {process.estimated_value}</div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handlePolicyImport} 
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportPolicyFromSalesDialog;
