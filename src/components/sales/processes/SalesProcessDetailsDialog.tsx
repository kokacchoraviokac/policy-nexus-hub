import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SalesProcess } from "@/hooks/sales/useSalesProcessData";
import ImportPolicyFromSalesDialog from "./ImportPolicyFromSalesDialog";
import { FileImport } from "lucide-react";

interface SalesProcessDetailsDialogProps {
  process: SalesProcess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SalesProcessDetailsDialog: React.FC<SalesProcessDetailsDialogProps> = ({
  process,
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Process stage badge styling
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'quote':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("quoteManagement")}</Badge>;
      case 'authorization':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{t("clientAuthorization")}</Badge>;
      case 'proposal':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t("policyProposal")}</Badge>;
      case 'signed':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{t("signedPolicies")}</Badge>;
      case 'concluded':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("concluded")}</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  // Insurance type badge styling
  const getInsuranceTypeBadge = (type: string) => {
    switch (type) {
      case 'life':
        return <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">{t("life")}</Badge>;
      case 'nonLife':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("nonLife")}</Badge>;
      case 'health':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("health")}</Badge>;
      case 'property':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{t("property")}</Badge>;
      case 'auto':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{t("auto")}</Badge>;
      case 'travel':
        return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">{t("travel")}</Badge>;
      case 'business':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">{t("business")}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Determine if the process is ready for policy import
  const isReadyForPolicyImport = process.stage === "concluded" && process.status === "completed";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{process.title}</span>
              {getStageBadge(process.stage)}
            </DialogTitle>
            {process.company && (
              <DialogDescription>
                {process.company}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t("clientInformation")}</h4>
                <div className="mt-1 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">{t("clientName")}: </span>
                    {process.client_name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">{t("insuranceType")}: </span>
                    {getInsuranceTypeBadge(process.insurance_type)}
                  </p>
                  {process.estimated_value && (
                    <p className="text-sm">
                      <span className="font-medium">{t("estimatedValue")}: </span>
                      {process.estimated_value}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t("processDetails")}</h4>
                <div className="mt-1 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">{t("createdAt")}: </span>
                    {format(new Date(process.created_at), "PPP")}
                  </p>
                  {process.expected_close_date && (
                    <p className="text-sm">
                      <span className="font-medium">{t("expectedCloseDate")}: </span>
                      {format(new Date(process.expected_close_date), "PPP")}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">{t("responsiblePerson")}: </span>
                    {process.responsible_person || t("notAssigned")}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">{t("status")}: </span>
                    <Badge 
                      variant={process.status === "active" ? "default" : process.status === "completed" ? "secondary" : "destructive"}
                      className={process.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs" : "text-xs"}
                    >
                      {t(process.status)}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
            
            {process.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("notes")}</h4>
                  <p className="text-sm whitespace-pre-wrap">{process.notes}</p>
                </div>
              </>
            )}
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("quoteInformation")}</h4>
              <p className="text-sm text-muted-foreground italic">
                {process.stage === "quote" 
                  ? t("noQuotesYet") 
                  : t("quotesInProgress")}
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
                onClick={() => onOpenChange(false)}
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
                  onClick={() => setImportDialogOpen(true)}
                >
                  <FileImport className="h-4 w-4" />
                  {t("importPolicy")}
                </Button>
              )}
              <Button variant="default" size="sm">
                {t("editProcess")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportPolicyFromSalesDialog 
        process={process}
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
    </>
  );
};

export default SalesProcessDetailsDialog;
