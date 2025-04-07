
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesProcess } from "@/types/salesProcess";
import { StageBadge } from "./badges/StatusBadges";
import ProcessOverviewTab from "./tabs/ProcessOverviewTab";
import ImportPolicyFromSalesDialog from "./ImportPolicyFromSalesDialog";
import { useSalesProcessStageTransition } from "@/hooks/sales/useSalesProcessStageTransition";
import QuotesTab from "./tabs/QuotesTab";
import ProposalsTab from "./tabs/ProposalsTab";
import DocumentsTab from "./tabs/DocumentsTab";
import SalesProcessDialogFooter from "./SalesProcessDialogFooter";

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
  
  const {
    process: updatedProcess,
    selectedQuoteId,
    isReadyForPolicyImport,
    handleQuoteSelected,
    handleMoveToNextStage
  } = useSalesProcessStageTransition(process, onMoveToNextStage);

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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="quotes">{t("quotes")}</TabsTrigger>
              <TabsTrigger value="proposals">{t("proposals")}</TabsTrigger>
              <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <ProcessOverviewTab process={updatedProcess} />
            </TabsContent>
            
            <TabsContent value="quotes">
              <QuotesTab process={updatedProcess} onQuoteSelected={handleQuoteSelected} />
            </TabsContent>
            
            <TabsContent value="proposals">
              <ProposalsTab process={updatedProcess} />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsTab 
                salesProcess={updatedProcess}
                salesStage={updatedProcess.stage} 
              />
            </TabsContent>
          </Tabs>
          
          <SalesProcessDialogFooter
            process={updatedProcess}
            onClose={() => onOpenChange(false)}
            onMoveToNextStage={handleMoveToNextStage}
            isReadyForPolicyImport={isReadyForPolicyImport}
            onImportPolicy={() => setImportDialogOpen(true)}
          />
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
