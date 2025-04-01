
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
import { FileText, Calendar, User, Building, FileCheck } from "lucide-react";
import { Proposal } from "./ProposalsList";

interface ProposalViewDialogProps {
  proposal: Proposal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProposalViewDialog: React.FC<ProposalViewDialogProps> = ({
  proposal,
  open,
  onOpenChange
}) => {
  const { t, formatDateTime } = useLanguage();
  
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
              {formatDateTime(proposal.createdAt)}
            </div>
            <Badge className="ml-2">{t(proposal.status)}</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("clientDetails")}</div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                {proposal.clientName}
              </div>
            </div>
            
            {proposal.insurerName && (
              <div className="space-y-2">
                <div className="text-sm font-medium">{t("insurerDetails")}</div>
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  {proposal.insurerName}
                </div>
              </div>
            )}
          </div>
          
          {proposal.coverageDetails && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("coverageDetails")}</div>
              <div className="text-sm rounded-md bg-muted p-3">
                {proposal.coverageDetails}
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
          
          {proposal.documents && proposal.documents.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("attachedDocuments")}</div>
              <div className="space-y-1">
                {proposal.documents.map((doc, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {proposal.sentAt && (
            <div className="text-sm text-muted-foreground">
              {t("sentAt")}: {formatDateTime(proposal.sentAt)}
            </div>
          )}
          
          {proposal.viewedAt && (
            <div className="text-sm text-muted-foreground">
              {t("viewedAt")}: {formatDateTime(proposal.viewedAt)}
            </div>
          )}
          
          {proposal.expiresAt && (
            <div className="text-sm text-muted-foreground">
              {t("expiresAt")}: {formatDateTime(proposal.expiresAt)}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
          {proposal.status === "draft" && (
            <Button>
              <FileCheck className="h-4 w-4 mr-2" />
              {t("editProposal")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalViewDialog;
