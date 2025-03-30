
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActivityLogger } from "@/utils/activityLogger";
import { DocumentApprovalStatus } from "@/types/documents";

interface ApproveDocumentParams {
  documentId: string;
  status: DocumentApprovalStatus;
  notes?: string;
  entityType: "policy" | "claim" | "sales_process";
  entityId: string;
}

export const useDocumentApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { logActivity } = useActivityLogger();
  
  return useMutation({
    mutationFn: async ({ documentId, status, notes, entityType, entityId }: ApproveDocumentParams) => {
      // Get the appropriate table name based on entity type
      let tableName = "claim_documents";
      if (entityType === "policy") tableName = "policy_documents";
      if (entityType === "sales_process") tableName = "sales_documents";
      
      // Get user info
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      // Update document approval status
      const { data, error } = await supabase
        .from(tableName)
        .update({
          approval_status: status,
          approval_notes: notes,
          approved_by: userId,
          approved_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();
        
      if (error) throw error;
      
      // Log the approval activity
      await logActivity({
        entityType,
        entityId,
        action: "update",
        details: {
          action_type: "document_approval",
          document_id: documentId,
          approval_status: status,
          notes
        }
      });
      
      return data;
    },
    onSuccess: (_, variables) => {
      const { status, entityType, entityId } = variables;
      
      // Success message based on the approval status
      let message = "";
      switch (status) {
        case "approved":
          message = t("documentApproved");
          break;
        case "rejected":
          message = t("documentRejected");
          break;
        case "needs_review":
          message = t("documentMarkedForReview");
          break;
        default:
          message = t("documentStatusUpdated");
      }
      
      toast({
        title: message,
        description: t("documentStatusUpdateSuccess")
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    },
    onError: (error) => {
      console.error("Error updating document approval status:", error);
      toast({
        title: t("errorUpdatingDocument"),
        description: t("errorOccurredTryAgain"),
        variant: "destructive"
      });
    }
  });
};
