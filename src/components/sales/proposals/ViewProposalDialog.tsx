
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FileDownload, XCircle } from "lucide-react";
import { Proposal, ProposalStatus } from "@/types/sales";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";

interface ViewProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal: Proposal;
  onUpdateStatus?: (proposalId: string, status: ProposalStatus) => Promise<void>;
}

const ViewProposalDialog: React.FC<ViewProposalDialogProps> = ({
  open,
  onOpenChange,
  proposal,
  onUpdateStatus
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpdateStatus = async (status: ProposalStatus) => {
    if (!onUpdateStatus) return;
    
    setIsLoading(true);
    try {
      await onUpdateStatus(proposal.id, status);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating proposal status:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getBadgeVariant = (status: ProposalStatus) => {
    switch (status) {
      case "draft": return "secondary";
      case "sent": return "info";
      case "accepted": return "success";
      case "rejected": return "destructive";
      case "expired": return "warning";
      default: return "default";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("viewProposal")}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg font-semibold">{proposal.title}</h3>
            <Badge variant={getBadgeVariant(proposal.status)}>
              {t(proposal.status)}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("client")}</p>
              <p className="font-medium">{proposal.client_name}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">{t("createdDate")}</p>
              <p className="font-medium">{formatDate(proposal.created_at)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">{t("estimatedValue")}</p>
              <p className="font-medium">
                {formatCurrency(proposal.estimated_value, proposal.currency)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">{t("expiryDate")}</p>
              <p className="font-medium">{formatDate(proposal.expiry_date)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
            <p className="mt-1">{proposal.description}</p>
          </div>
          
          <Separator />
          
          <div className="flex flex-col space-y-4">
            <h4 className="font-medium">{t("proposalDocuments")}</h4>
            
            {proposal.document_url ? (
              <Button variant="secondary" className="w-full md:w-auto">
                <FileDownload className="h-4 w-4 mr-2" />
                {t("downloadProposal")}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("noDocumentsAttached")}
              </p>
            )}
          </div>
          
          {proposal.status === "draft" && onUpdateStatus && (
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="default"
                onClick={() => handleUpdateStatus("sent")}
                disabled={isLoading}
              >
                {t("markAsSent")}
              </Button>
            </div>
          )}
          
          {proposal.status === "sent" && onUpdateStatus && (
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="default"
                onClick={() => handleUpdateStatus("accepted")}
                disabled={isLoading}
              >
                {t("markAsAccepted")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleUpdateStatus("rejected")}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {t("markAsRejected")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProposalDialog;
