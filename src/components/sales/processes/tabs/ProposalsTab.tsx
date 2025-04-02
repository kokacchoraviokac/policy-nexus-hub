
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { SalesProcess } from "@/types/salesProcess";
import { useProposalsData } from "@/hooks/sales/useProposalsData";
import ProposalsList from "../../proposals/ProposalsList";
import CreateProposalDialog from "../../proposals/CreateProposalDialog";

interface ProposalsTabProps {
  process: SalesProcess;
}

const ProposalsTab: React.FC<ProposalsTabProps> = ({ process }) => {
  const { t } = useLanguage();
  const [createProposalDialogOpen, setCreateProposalDialogOpen] = useState(false);
  
  const { 
    proposals, 
    isLoading, 
    createProposal,
    updateProposalStatus
  } = useProposalsData({
    salesProcessId: process.id,
    clientName: process.client_name
  });
  
  return (
    <div className="pt-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">{t("proposalManagement")}</h3>
        <Button size="sm" onClick={() => setCreateProposalDialogOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          {t("createProposal")}
        </Button>
      </div>
      
      {isLoading ? (
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
      
      <CreateProposalDialog
        open={createProposalDialogOpen}
        onOpenChange={setCreateProposalDialogOpen}
        salesProcessId={process.id}
        clientName={process.client_name}
        onProposalCreated={createProposal}
      />
    </div>
  );
};

export default ProposalsTab;
