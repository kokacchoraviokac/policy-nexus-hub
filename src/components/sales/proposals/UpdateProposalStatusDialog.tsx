
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
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ProposalStatus } from "@/types/sales";

interface UpdateProposalStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (status: ProposalStatus) => Promise<void>;
  currentStatus: ProposalStatus;
}

const UpdateProposalStatusDialog: React.FC<UpdateProposalStatusDialogProps> = ({
  open,
  onOpenChange,
  onUpdateStatus,
  currentStatus
}) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<ProposalStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(status);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating proposal status:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Define available statuses based on current status
  // This represents a simple status workflow
  const getAvailableStatuses = () => {
    switch (currentStatus) {
      case ProposalStatus.DRAFT:
        return [
          { value: ProposalStatus.SENT, label: t("sent") }
        ];
      case ProposalStatus.SENT:
        return [
          { value: ProposalStatus.VIEWED, label: t("viewed") },
          { value: ProposalStatus.ACCEPTED, label: t("accepted") },
          { value: ProposalStatus.REJECTED, label: t("rejected") }
        ];
      case ProposalStatus.VIEWED:
        return [
          { value: ProposalStatus.ACCEPTED, label: t("accepted") },
          { value: ProposalStatus.REJECTED, label: t("rejected") }
        ];
      default:
        return [];
    }
  };
  
  const availableStatuses = getAvailableStatuses();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("updateProposalStatus")}</DialogTitle>
          <DialogDescription>
            {t("selectNewStatusForProposal")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as ProposalStatus)}
            className="space-y-3"
          >
            {availableStatuses.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isUpdating || status === currentStatus || availableStatuses.length === 0}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("updating")}
              </>
            ) : (
              t("update")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProposalStatusDialog;
