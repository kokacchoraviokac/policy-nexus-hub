
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/hooks/sales/useSalesProcessData";
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
import { CheckCircle, FileUp, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImportPolicyFromQuoteDialogProps {
  process: SalesProcess;
  quote: {
    id: string;
    insurer: string;
    amount: string;
    coverage: string;
    status: string;
    date: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportPolicyFromQuoteDialog: React.FC<ImportPolicyFromQuoteDialogProps> = ({
  process,
  quote,
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
      console.log("Preparing policy import from quote:", {
        processId: process.id,
        quoteId: quote.id,
        insurer: quote.insurer,
        amount: quote.amount
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(t("quoteReadyForImport"), {
        description: t("redirectingToPolicyImport"),
      });
      
      onOpenChange(false);
      
      // In a real implementation, we would pass the quote ID and process ID in query params
      navigate(`/policies/import?from_sales=${process.id}&quote_id=${quote.id}`);
      
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
          <DialogTitle>{t("importPolicyFromQuote")}</DialogTitle>
          <DialogDescription>
            {t("importPolicyFromQuoteDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">{t("quoteSelected")}</AlertTitle>
            <AlertDescription className="text-green-600">
              {t("selectedQuoteReadyForImport")}
            </AlertDescription>
          </Alert>
          
          <Card className="border">
            <CardContent className="pt-6 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">{t("processTitle")}:</span> {process.title}</div>
                  <div><span className="font-medium">{t("clientName")}:</span> {process.client_name}</div>
                  <div><span className="font-medium">{t("insurer")}:</span> {quote.insurer}</div>
                  <div><span className="font-medium">{t("amount")}:</span> {quote.amount}</div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{t("coverage")}:</span> 
                  <p className="mt-1">{quote.coverage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="rounded-md border p-4 bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-700 mb-2">{t("importPolicySteps")}</h3>
            <ul className="text-sm text-blue-600 space-y-1 pl-5 list-disc">
              <li>{t("importStep1")}</li>
              <li>{t("importStep2")}</li>
              <li>{t("importStep3")}</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handlePolicyImport} 
            disabled={isImporting}
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

export default ImportPolicyFromQuoteDialog;
