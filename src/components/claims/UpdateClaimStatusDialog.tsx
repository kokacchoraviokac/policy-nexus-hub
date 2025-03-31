
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClaimStatusUpdate } from "@/hooks/claims/useClaimStatusUpdate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import StatusSelector from "@/components/common/StatusSelector";

interface UpdateClaimStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claimId: string;
  currentStatus: string;
  onSuccess?: () => void;
}

const UpdateClaimStatusDialog: React.FC<UpdateClaimStatusDialogProps> = ({
  open,
  onOpenChange,
  claimId,
  currentStatus,
  onSuccess
}) => {
  const { t } = useLanguage();
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [statusNote, setStatusNote] = useState("");
  
  const { mutate: updateStatus, isPending: isUpdating } = useClaimStatusUpdate(() => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  });
  
  const handleSubmit = () => {
    updateStatus({
      claimId,
      currentStatus,
      newStatus,
      statusNote
    });
  };
  
  const claimStatusOptions = [
    "in processing",
    "reported",
    "accepted",
    "rejected",
    "appealed",
    "partially accepted",
    "withdrawn"
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("updateStatus")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currentStatus">{t("currentStatus")}</Label>
            <div id="currentStatus" className="px-3 py-2 border rounded-md bg-muted/50">
              {t(currentStatus.replace(/ /g, ""))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newStatus">{t("newStatus")}</Label>
            <StatusSelector
              value={newStatus}
              onValueChange={setNewStatus}
              statusOptions={claimStatusOptions}
              placeholder={t("selectStatus")}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="statusNote">{t("notes")}</Label>
            <Textarea
              id="statusNote"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder={t("additionalNotesDescription")}
              className="min-h-[100px]"
            />
          </div>
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
            disabled={isUpdating || newStatus === currentStatus}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default UpdateClaimStatusDialog;
