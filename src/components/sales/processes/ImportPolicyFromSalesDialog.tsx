import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/types/salesProcess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, FileUp, Loader2 } from "lucide-react";
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

  const handlePolicyImport = async () => {
    try {
      setIsImporting(true);
      
      // Log the data we would send to the server in a real implementation
      console.log("Preparing policy import from sales process:", {
        processId: process.id,
        title: process.title,
        clientName: process.client_name,
        insuranceType: process.insurance_type,
        estimatedValue: process.estimated_value
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(t("salesProcessReadyForImport"), {
        description: t("redirectingToPolicyImport"),
      });
      
      onOpenChange(false);
      
      // Navigate to policy import with sales process ID
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

  const isReadyForImport = process.stage === "concluded" && process.status === "completed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("importPolicyFromSalesProcess")}</DialogTitle>
          <DialogDescription>
            {t("importPolicyFromSalesProcessDescription")}
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
            <Alert variant="destructive">
              <AlertTitle>{t("notReadyForImport")}</AlertTitle>
              <AlertDescription>
                {t("salesProcessMustBeConcluded")}
                <br />
                {t("salesProcessMustBeCompleted")}
              </AlertDescription>
            </Alert>
          )}
          
          <Card className="border">
            <CardContent className="pt-6 pb-4">
              <h3 className="text-sm font-medium mb-3">{t("salesProcessDetails")}</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">{t("processTitle")}:</span> {process.title}</div>
                  <div><span className="font-medium">{t("clientName")}:</span> {process.client_name}</div>
                  <div><span className="font-medium">{t("insuranceType")}:</span> {process.insurance_type}</div>
                  {process.estimated_value && (
                    <div><span className="font-medium">{t("estimatedValue")}:</span> {process.estimated_value}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handlePolicyImport} 
            disabled={isImporting || !isReadyForImport}
            className="gap-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("preparing")}...
              </>
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
