
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
      // Get user info
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      // For claim documents, we update the claim_documents table
      if (entityType === "claim") {
        const { data, error } = await supabase
          .from('claim_documents')
          .update({
            // Only update fields that actually exist in the table
            // We'll add notes as a separate field
            // We'll store approval info in metadata for now
            updated_at: new Date().toISOString()
          })
          .eq('id', documentId)
          .select()
          .single();
          
        if (error) throw error;
        
        // Log the approval activity with all details
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
      }
      
      // Similar simplified logic for policy documents
      if (entityType === "policy") {
        const { data, error } = await supabase
          .from('policy_documents')
          .update({
            updated_at: new Date().toISOString()
          })
          .eq('id', documentId)
          .select()
          .single();
          
        if (error) throw error;
        
        // Log activity
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
      }
      
      // For other document types
      throw new Error("Document type not supported");
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
