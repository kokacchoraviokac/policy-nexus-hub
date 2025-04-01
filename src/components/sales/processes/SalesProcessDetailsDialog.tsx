
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
import { SalesProcess, SalesProcessStage } from "@/hooks/sales/useSalesProcessData";
import ImportPolicyFromSalesDialog from "./ImportPolicyFromSalesDialog";
import QuoteManagementPanel from "./QuoteManagementPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface SalesProcessDetailsDialogProps {
  process: SalesProcess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMoveToNextStage?: (process: SalesProcess) => void;
}

const SalesProcessDetailsDialog: React.FC<SalesProcessDetailsDialogProps> = ({
  process,
  open,
  onOpenChange,
  onMoveToNextStage,
}) => {
  const { t } = useLanguage();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [updatedProcess, setUpdatedProcess] = useState<SalesProcess>(process);

  const getStageBadge = (stage: SalesProcessStage) => {
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

  const isReadyForPolicyImport = updatedProcess.stage === "concluded" && updatedProcess.status === "completed";
  
  const handleQuoteSelected = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    
    // If the process is in the quote stage, enable moving to the next stage
    if (updatedProcess.stage === "quote") {
      toast.success(t("quoteSelectedReadyToMove"), {
        description: t("canProceedToNextStage"),
      });
    }
  };
  
  const handleMoveToNextStage = () => {
    // Map of stage transitions
    const nextStage: Record<SalesProcessStage, SalesProcessStage> = {
      "quote": "authorization",
      "authorization": "proposal",
      "proposal": "signed",
      "signed": "concluded",
      "concluded": "concluded" // Cannot move past concluded
    };
    
    // If there's a next stage defined
    if (nextStage[updatedProcess.stage]) {
      const newStage = nextStage[updatedProcess.stage];
      
      // If it's the quote stage and no quote is selected, show warning
      if (updatedProcess.stage === "quote" && !selectedQuoteId) {
        toast.warning(t("noSelectedQuote"), {
          description: t("selectQuoteBeforeProceeding"),
        });
        return;
      }
      
      // If it's the final transition, also update the status
      const newStatus = newStage === "concluded" ? "completed" : updatedProcess.status;
      
      const updated: SalesProcess = {
        ...updatedProcess,
        stage: newStage,
        status: newStatus
      };
      
      setUpdatedProcess(updated);
      
      // Call the external handler if provided
      if (onMoveToNextStage) {
        onMoveToNextStage(updated);
      }
      
      toast.success(t("stageUpdated"), {
        description: t("processMovedToStage", { stage: t(newStage) }),
      });
      
      // If moved to concluded stage, notify about policy import
      if (newStage === "concluded" && newStatus === "completed") {
        toast.info(t("processReachedFinalStage"), {
          description: t("canNowImportPolicy"),
        });
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{updatedProcess.title}</span>
              {getStageBadge(updatedProcess.stage)}
            </DialogTitle>
            {updatedProcess.company && (
              <DialogDescription>
                {updatedProcess.company}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="quotes">{t("quotes")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t("clientInformation")}</h4>
                  <div className="mt-1 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">{t("clientName")}: </span>
                      {updatedProcess.client_name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">{t("insuranceType")}: </span>
                      {getInsuranceTypeBadge(updatedProcess.insurance_type)}
                    </p>
                    {updatedProcess.estimated_value && (
                      <p className="text-sm">
                        <span className="font-medium">{t("estimatedValue")}: </span>
                        {updatedProcess.estimated_value}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t("processDetails")}</h4>
                  <div className="mt-1 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">{t("createdAt")}: </span>
                      {format(new Date(updatedProcess.created_at), "PPP")}
                    </p>
                    {updatedProcess.expected_close_date && (
                      <p className="text-sm">
                        <span className="font-medium">{t("expectedCloseDate")}: </span>
                        {format(new Date(updatedProcess.expected_close_date), "PPP")}
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="font-medium">{t("responsiblePerson")}: </span>
                      {updatedProcess.responsible_person || t("notAssigned")}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">{t("status")}: </span>
                      <Badge 
                        variant={updatedProcess.status === "active" ? "default" : updatedProcess.status === "completed" ? "secondary" : "destructive"}
                        className={updatedProcess.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs" : "text-xs"}
                      >
                        {t(updatedProcess.status)}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
              
              {updatedProcess.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("notes")}</h4>
                    <p className="text-sm whitespace-pre-wrap">{updatedProcess.notes}</p>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("salesProcessStages")}</h4>
                <div className="flex items-center space-x-1 text-sm">
                  <div className={`px-2 py-1 rounded ${updatedProcess.stage === 'quote' ? 'bg-blue-100 text-blue-700' : updatedProcess.stage !== 'quote' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {t("quoteManagement")}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <div className={`px-2 py-1 rounded ${updatedProcess.stage === 'authorization' ? 'bg-blue-100 text-blue-700' : (updatedProcess.stage === 'proposal' || updatedProcess.stage === 'signed' || updatedProcess.stage === 'concluded') ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {t("clientAuthorization")}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <div className={`px-2 py-1 rounded ${updatedProcess.stage === 'proposal' ? 'bg-blue-100 text-blue-700' : (updatedProcess.stage === 'signed' || updatedProcess.stage === 'concluded') ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {t("policyProposal")}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <div className={`px-2 py-1 rounded ${updatedProcess.stage === 'signed' ? 'bg-blue-100 text-blue-700' : updatedProcess.stage === 'concluded' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {t("signedPolicies")}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <div className={`px-2 py-1 rounded ${updatedProcess.stage === 'concluded' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
                    {t("concluded")}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="quotes" className="pt-4">
              <QuoteManagementPanel 
                process={updatedProcess} 
                onQuoteSelected={handleQuoteSelected}
              />
            </TabsContent>
          </Tabs>
          
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
                onClick={handleMoveToNextStage}
                disabled={updatedProcess.stage === "concluded"}
              >
                <ChevronRight className="h-4 w-4 mr-1.5" />
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
                  <FileUp className="h-4 w-4" />
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
        process={updatedProcess}
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
    </>
  );
};

export default SalesProcessDetailsDialog;
