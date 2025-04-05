
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DocumentApprovalStatus, EntityType } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { fromDocumentTable } from "@/utils/supabaseTypeAssertions";

interface UpdateApprovalParams {
  documentId: string;
  entityType: EntityType;
  status: DocumentApprovalStatus;
  notes?: string;
}

interface UseDocumentApprovalProps {
  onSuccess?: () => void;
}

export const useDocumentApproval = ({ onSuccess }: UseDocumentApprovalProps = {}) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  
  const approvalMutation = useMutation({
    mutationFn: async ({ documentId, entityType, status, notes }: UpdateApprovalParams) => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        
        const tableName = getDocumentTableName(entityType);
        
        // Create update data
        const updateData: any = {
          approval_status: status,
          approval_notes: notes,
          approved_by: user.id,
          approved_at: new Date().toISOString()
        };
        
        // Use our safe wrapper for supabase queries
        const { data, error } = await fromDocumentTable(tableName)
          .update(updateData)
          .eq('id', documentId)
          .select()
          .single();
          
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error("Error updating document approval status:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: ['documents', variables.entityType]
      });
      
      // Show success message based on status
      const statusMessages: Record<DocumentApprovalStatus, string> = {
        approved: t("documentApproved"),
        rejected: t("documentRejected"),
        pending: t("documentMarkedAsPending"),
        needs_review: t("documentMarkedForReview")
      };
      
      toast.success(statusMessages[variables.status] || t("documentStatusUpdated"));
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      console.error("Approval update error:", error);
      toast.error(error.message || t("errorUpdatingDocumentStatus"));
    }
  });
  
  return {
    updateApprovalStatus: approvalMutation.mutate,
    isUpdating: approvalMutation.isPending
  };
};
