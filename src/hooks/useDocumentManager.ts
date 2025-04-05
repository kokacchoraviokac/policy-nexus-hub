
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document, DocumentApprovalStatus, EntityType } from "@/types/documents";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { getErrorMessage } from "@/utils/errorHandling";
import { useSupabaseQuery } from "@/utils/useSupabaseQuery";

interface UseDocumentManagerProps {
  entityType: EntityType;
  entityId: string;
}

export function useDocumentManager({ entityType, entityId }: UseDocumentManagerProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { executeQuery, updateData, deleteData } = useSupabaseQuery();
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch documents
  const {
    data: documents = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['documents', entityType, entityId],
    queryFn: async () => {
      const tableName = getDocumentTableName(entityType);
      const entityIdField = `${entityType}_id`;
      
      const { data, error } = await executeQuery<Document>(
        tableName,
        (query) => query
          .select('*')
          .eq(entityIdField, entityId)
          .order('created_at', { ascending: false })
      );
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!entityId,
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const tableName = getDocumentTableName(entityType);
      const { error } = await deleteData(tableName, documentId);
      if (error) throw error;
      return documentId;
    },
    onSuccess: () => {
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    },
    onError: (error) => {
      toast({
        title: t("deleteError"),
        description: getErrorMessage(error),
        variant: "destructive",
      });
    },
  });

  // Update document approval status
  const updateApprovalMutation = useMutation({
    mutationFn: async ({ documentId, status, notes = "" }: { 
      documentId: string; 
      status: DocumentApprovalStatus; 
      notes?: string 
    }) => {
      const tableName = getDocumentTableName(entityType);
      
      const { data, error } = await updateData<Document>(
        tableName,
        documentId,
        {
          approval_status: status,
          approval_notes: notes,
          approved_at: new Date().toISOString(),
          // We would normally use the actual user id here
          approved_by: "current-user-id"
        }
      );
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: t("approvalUpdated"),
        description: t("documentApprovalStatusUpdated"),
      });
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    },
    onError: (error) => {
      toast({
        title: t("updateError"),
        description: getErrorMessage(error),
        variant: "destructive",
      });
    },
  });

  return {
    documents,
    isLoading,
    isError,
    error: error as Error,
    deleteDocument: deleteMutation.mutate,
    updateDocumentApproval: updateApprovalMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isUpdatingApproval: updateApprovalMutation.isPending,
    refreshDocuments: refetch,
    refetch
  };
}
