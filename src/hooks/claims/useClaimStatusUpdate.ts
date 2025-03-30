
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { StatusHistoryEntry } from "@/hooks/claims/useClaimDetail";
import { Json } from "@/integrations/supabase/types";

interface UpdateStatusParams {
  claimId: string;
  currentStatus: string;
  newStatus: string;
  statusNote: string;
}

export const useClaimStatusUpdate = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({ claimId, currentStatus, newStatus, statusNote }: UpdateStatusParams) => {
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
      
      // Ensure we have an array of history entries
      let statusHistory: Json;
      if (Array.isArray(existingClaim.status_history)) {
        statusHistory = [...existingClaim.status_history, statusChange] as Json;
      } else {
        statusHistory = [statusChange] as Json;
      }
      
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
      queryClient.invalidateQueries({ queryKey: ['claim'] });
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['policy-claims'] });
      
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
};
