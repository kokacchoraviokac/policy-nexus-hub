
import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [statusNote, setStatusNote] = useState("");

  // Update claim status mutation
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('claims')
        .update({ 
          status: newStatus,
          notes: statusNote ? `${new Date().toISOString()}: ${statusNote}` : undefined 
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
                  <SelectItem value="appealed">{t("appealed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
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
            <Button type="submit" disabled={isPending || newStatus === currentStatus}>
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
