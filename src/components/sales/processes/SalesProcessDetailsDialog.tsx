
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, ChevronRight, FileText } from "lucide-react";
import { SalesProcess } from "@/hooks/sales/useSalesProcessData";
import { StageBadge } from "./badges/StatusBadges";
import ProcessOverviewTab from "./tabs/ProcessOverviewTab";
import QuoteManagementPanel from "./QuoteManagementPanel";
import ImportPolicyFromSalesDialog from "./ImportPolicyFromSalesDialog";
import { useSalesProcessStageTransition } from "@/hooks/sales/useSalesProcessStageTransition";
import { useProposalsData } from "@/hooks/sales/useProposalsData";
import ProposalsList from "../proposals/ProposalsList";
import CreateProposalDialog from "../proposals/CreateProposalDialog";

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
  const [createProposalDialogOpen, setCreateProposalDialogOpen] = useState(false);
  
  const {
    process: updatedProcess,
    selectedQuoteId,
    isReadyForPolicyImport,
    handleQuoteSelected,
    handleMoveToNextStage
  } = useSalesProcessStageTransition(process, onMoveToNextStage);

  const { 
    proposals, 
    isLoading: proposalsLoading, 
    createProposal,
    updateProposalStatus
  } = useProposalsData({
    salesProcessId: process.id,
    clientName: process.client_name
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{updatedProcess.title}</span>
              <StageBadge stage={updatedProcess.stage} />
            </DialogTitle>
            {updatedProcess.company && (
              <DialogDescription>
                {updatedProcess.company}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="quotes">{t("quotes")}</TabsTrigger>
              <TabsTrigger value="proposals">{t("proposals")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <ProcessOverviewTab process={updatedProcess} />
            </TabsContent>
            
            <TabsContent value="quotes" className="pt-4">
              <QuoteManagementPanel 
                process={updatedProcess} 
                onQuoteSelected={handleQuoteSelected}
              />
            </TabsContent>
            
            <TabsContent value="proposals" className="pt-4">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">{t("proposalManagement")}</h3>
                <Button size="sm" onClick={() => setCreateProposalDialogOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  {t("createProposal")}
                </Button>
              </div>
              
              {proposalsLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : proposals.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-48 p-6 border rounded-md">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">{t("noProposalsYet")}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {t("createFirstProposal")}
                  </p>
                  <Button onClick={() => setCreateProposalDialogOpen(true)}>
                    {t("createProposal")}
                  </Button>
                </div>
              ) : (
                <ProposalsList 
                  proposals={proposals}
                  onStatusChange={updateProposalStatus}
                />
              )}
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
      
      <CreateProposalDialog
        open={createProposalDialogOpen}
        onOpenChange={setCreateProposalDialogOpen}
        salesProcessId={process.id}
        clientName={process.client_name}
        onProposalCreated={createProposal}
      />
    </>
  );
};

export default SalesProcessDetailsDialog;
