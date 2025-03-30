
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import StatusSelector from "./status/StatusSelector";
import { useClaimStatusUpdate } from "@/hooks/claims/useClaimStatusUpdate";

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

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setNewStatus(currentStatus);
      setStatusNote("");
    }
  }, [open, currentStatus]);

  // Use the custom hook for status updates
  const { mutate: updateStatus, isPending } = useClaimStatusUpdate(() => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus({
      claimId,
      currentStatus,
      newStatus,
      statusNote
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("updateClaimStatus")}</DialogTitle>
          <DialogDescription>
            {t("updateClaimStatusDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <StatusSelector
              currentStatus={currentStatus}
              newStatus={newStatus}
              onStatusChange={setNewStatus}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("statusNote")}</label>
              <Textarea 
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder={t("enterStatusNoteOptional")}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || newStatus === currentStatus}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("updating")}
                </>
              ) : (
                t("updateStatus")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateClaimStatusDialog;
