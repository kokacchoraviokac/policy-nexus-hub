
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Proposal, ProposalStatus } from "./ProposalsList";
import { toast } from "sonner";

interface UpdateProposalStatusDialogProps {
  proposal: Proposal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: ProposalStatus) => void;
}

const UpdateProposalStatusDialog: React.FC<UpdateProposalStatusDialogProps> = ({
  proposal,
  open,
  onOpenChange,
  onStatusChange
}) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<ProposalStatus>(proposal.status);
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  
  // Determine available status transitions based on current status
  const getAvailableStatuses = () => {
    switch (proposal.status) {
      case "sent":
        return ["viewed", "accepted", "rejected", "expired"];
      case "viewed":
        return ["accepted", "rejected", "expired"];
      default:
        return [];
    }
  };
  
  const availableStatuses = getAvailableStatuses();
  
  const handleUpdate = () => {
    setUpdating(true);
    
    // Simulate updating process
    setTimeout(() => {
      setUpdating(false);
      onStatusChange(status);
      toast.success(t("statusUpdated"), {
        description: t("proposalStatusUpdatedTo", { status: t(status) })
      });
      onOpenChange(false);
    }, 1000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("updateProposalStatus")}</DialogTitle>
          <DialogDescription>
            {t("updateProposalStatusDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("currentStatus")}</Label>
            <div className="font-medium">{t(proposal.status)}</div>
          </div>
          
          <div className="space-y-2">
            <Label>{t("newStatus")}</Label>
            <RadioGroup value={status} onValueChange={(value) => setStatus(value as ProposalStatus)}>
              {availableStatuses.map(s => (
                <div key={s} className="flex items-center space-x-2">
                  <RadioGroupItem value={s} id={`status-${s}`} />
                  <Label htmlFor={`status-${s}`}>{t(s)}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t("statusNotes")}</Label>
            <Textarea
              id="notes"
              placeholder={t("optionalStatusNotes")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleUpdate} disabled={updating || status === proposal.status}>
            {updating ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-b-transparent" />
                {t("updating")}
              </>
            ) : (
              t("updateStatus")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProposalStatusDialog;
