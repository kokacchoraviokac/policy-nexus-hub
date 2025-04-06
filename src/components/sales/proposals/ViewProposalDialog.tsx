
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, User, Building, FileCheck } from "lucide-react";
import { Proposal, ProposalStatus } from "@/types/sales";

interface ViewProposalDialogProps {
  proposal: Proposal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (proposalId: string, status: ProposalStatus) => Promise<void>;
}

const ViewProposalDialog: React.FC<ViewProposalDialogProps> = ({
  proposal,
  open,
  onOpenChange,
  onStatusChange
}) => {
  const { t, formatDateTime } = useLanguage();
  
  const handleStatusChange = async (status: ProposalStatus) => {
    if (onStatusChange) {
      try {
        await onStatusChange(proposal.id, status);
        // Close the dialog after changing status
        onOpenChange(false);
      } catch (error) {
        console.error("Error changing proposal status:", error);
      }
    }
  };
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "draft": return "secondary";
      case "sent": return "warning";
      case "viewed": return "secondary";
      case "accepted": return "success";
      case "rejected": return "destructive";
      case "approved": return "success";
      case "pending": return "warning";
      default: return "default";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{proposal.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDateTime(proposal.created_at)}
            </div>
            <Badge variant={getBadgeVariant(proposal.status as string)}>
              {t(proposal.status)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("clientDetails")}</div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                {proposal.client_name}
              </div>
            </div>
            
            {proposal.insurer_name && (
              <div className="space-y-2">
                <div className="text-sm font-medium">{t("insurerDetails")}</div>
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  {proposal.insurer_name}
                </div>
              </div>
            )}
          </div>
          
          {proposal.coverage_details && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("coverageDetails")}</div>
              <div className="text-sm rounded-md bg-muted p-3">
                {proposal.coverage_details}
              </div>
            </div>
          )}
          
          {proposal.premium && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("premium")}</div>
              <div className="text-sm font-semibold">{proposal.premium}</div>
            </div>
          )}
          
          {proposal.notes && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("notes")}</div>
              <div className="text-sm rounded-md bg-muted p-3">
                {proposal.notes}
              </div>
            </div>
          )}
          
          {proposal.document_ids && proposal.document_ids.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("attachedDocuments")}</div>
              <div className="space-y-1">
                {proposal.document_ids.map((doc, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {proposal.sent_at && (
            <div className="text-sm text-muted-foreground">
              {t("sentAt")}: {formatDateTime(proposal.sent_at)}
            </div>
          )}
          
          {proposal.viewed_at && (
            <div className="text-sm text-muted-foreground">
              {t("viewedAt")}: {formatDateTime(proposal.viewed_at)}
            </div>
          )}
          
          {proposal.expires_at && (
            <div className="text-sm text-muted-foreground">
              {t("expiresAt")}: {formatDateTime(proposal.expires_at)}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
          
          {proposal.status === ProposalStatus.DRAFT && onStatusChange && (
            <Button onClick={() => handleStatusChange(ProposalStatus.SENT)}>
              {t("markAsSent")}
            </Button>
          )}
          
          {proposal.status === ProposalStatus.SENT && onStatusChange && (
            <div className="flex gap-2">
              <Button onClick={() => handleStatusChange(ProposalStatus.ACCEPTED)}>
                {t("markAsAccepted")}
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleStatusChange(ProposalStatus.REJECTED)}
              >
                {t("markAsRejected")}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProposalDialog;
