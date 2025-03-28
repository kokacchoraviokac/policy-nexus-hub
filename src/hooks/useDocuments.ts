
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, UseDocumentsProps } from "@/types/documents";
import { fetchDocuments, deleteDocument as deleteDocumentUtil } from "@/utils/documentUtils";

// Re-export EntityType for proper isolated modules support
export type { EntityType } from "@/utils/activityLogger";
export type { DocumentTableName, Document } from "@/types/documents";

export const useDocuments = ({
  entityType,
  entityId,
  enabled = true
}: UseDocumentsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  // Fetch documents for a specific entity
  const {
    data: documents,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["documents", entityType, entityId],
    queryFn: () => fetchDocuments(entityType, entityId),
    enabled: enabled && !!entityType && !!entityId
  });
  
  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const result = await deleteDocumentUtil(documentId, entityType, entityId);
      
      // Log activity
      await logActivity({
        entityType,
        entityId,
        action: "update",
        details: {
          action_type: "document_deleted",
          document_id: documentId,
          document_name: documents?.find(doc => doc.id === documentId)?.document_name || "Unknown"
        }
      });
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", entityType, entityId] });
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error in delete mutation:", error);
      toast({
        title: t("documentDeleteError"),
        description: t("documentDeleteErrorMessage"),
        variant: "destructive",
      });
    },
  });
  
  // Handle document deletion
  const deleteDocument = async (documentId: string) => {
    if (!documentId) return;
    await deleteDocumentMutation.mutateAsync(documentId);
  };
  
  return {
    documents,
    isLoading,
    error,
    refetch,
    deleteDocument,
    isDeletingDocument: deleteDocumentMutation.isPending
  };
};
