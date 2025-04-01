
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
import { FileUp, ChevronRight } from "lucide-react";
import { SalesProcess } from "@/hooks/sales/useSalesProcessData";
import { StageBadge } from "./badges/StatusBadges";
import ProcessOverviewTab from "./tabs/ProcessOverviewTab";
import QuoteManagementPanel from "./QuoteManagementPanel";
import ImportPolicyFromSalesDialog from "./ImportPolicyFromSalesDialog";
import { useSalesProcessStageTransition } from "@/hooks/sales/useSalesProcessStageTransition";

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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="quotes">{t("quotes")}</TabsTrigger>
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
