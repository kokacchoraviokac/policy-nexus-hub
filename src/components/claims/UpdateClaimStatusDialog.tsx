import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusHistoryEntry } from "@/hooks/claims/useClaimDetail";

interface UpdateClaimStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claimId: string;
  currentStatus: string;
  onSuccess?: () => void;
}

// Valid status transitions map
const validStatusTransitions: Record<string, string[]> = {
  "in processing": ["reported", "rejected"],
  "reported": ["in processing", "accepted", "rejected", "partially accepted"],
  "accepted": ["in processing", "paid", "appealed"],
  "rejected": ["in processing", "appealed"],
  "appealed": ["in processing", "accepted", "rejected", "partially accepted"],
  "partially accepted": ["in processing", "paid", "appealed"],
  "paid": [],
  "withdrawn": []
};

const UpdateClaimStatusDialog: React.FC<UpdateClaimStatusDialogProps> = ({
  open,
  onOpenChange,
  claimId,
  currentStatus,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [statusNote, setStatusNote] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setNewStatus(currentStatus);
      setStatusNote("");
      setShowWarning(false);
    }
  }, [open, currentStatus]);

  // Get valid next statuses
  const validNextStatuses = validStatusTransitions[currentStatus] || [];
  const isValidTransition = newStatus === currentStatus || validNextStatuses.includes(newStatus);

  // Check if the transition is potentially problematic
  useEffect(() => {
    if (newStatus !== currentStatus) {
      setShowWarning(!isValidTransition);
    } else {
      setShowWarning(false);
    }
  }, [newStatus, currentStatus, isValidTransition]);

  // Update claim status mutation
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async () => {
      // Create status history entry
      const timestamp = new Date().toISOString();
      const statusChange: StatusHistoryEntry = {
        from: currentStatus,
        to: newStatus,
        note: statusNote,
        timestamp
      };
      
      // Get existing history or create new array
      const { data: existingClaim, error: fetchError } = await supabase
        .from('claims')
        .select('status_history, notes')
        .eq('id', claimId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const statusHistory = Array.isArray(existingClaim.status_history) 
        ? [...existingClaim.status_history, statusChange]
        : [statusChange];
      
      // Update claim with new status and history
      const { data, error } = await supabase
        .from('claims')
        .update({ 
          status: newStatus,
          status_history: statusHistory,
          notes: statusNote ? `${timestamp}: ${statusNote}\n${existingClaim.notes || ''}` : existingClaim.notes
        })
        .eq('id', claimId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: t("statusUpdated"),
        description: t("claimStatusUpdatedSuccessfully")
      });
      
      // Invalidate claim queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['claim', claimId] });
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['policy-claims'] });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Error updating claim status:", error);
      toast({
        title: t("errorUpdatingStatus"),
        description: t("errorOccurredTryAgain"),
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus();
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
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("currentStatus")}</label>
              <div className="p-2 bg-muted rounded-md">
                {t(currentStatus.toLowerCase().replace(/ /g, ""))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("newStatus")}</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectNewStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in processing">{t("inProcessing")}</SelectItem>
                  <SelectItem value="reported">{t("reported")}</SelectItem>
                  <SelectItem value="accepted">{t("accepted")}</SelectItem>
                  <SelectItem value="rejected">{t("rejected")}</SelectItem>
                  <SelectItem value="partially accepted">{t("partiallyAccepted")}</SelectItem>
                  <SelectItem value="appealed">{t("appealed")}</SelectItem>
                  <SelectItem value="paid">{t("paid")}</SelectItem>
                  <SelectItem value="withdrawn">{t("withdrawn")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {validNextStatuses.length > 0 && (
              <div className="px-3 py-2 bg-blue-50 text-blue-800 rounded-md flex items-start gap-2">
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">{t("recommendedStatusTransitions")}:</p>
                  <ul className="list-disc list-inside mt-1">
                    {validNextStatuses.map(status => (
                      <li key={status}>{t(status.toLowerCase().replace(/ /g, ""))}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {showWarning && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t("unusualStatusTransitionWarning")}
                </AlertDescription>
              </Alert>
            )}
            
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
