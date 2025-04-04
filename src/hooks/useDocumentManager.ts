
import { useState } from "react";
import { Document, DocumentApprovalStatus, EntityType } from "@/types/documents";
import { DocumentService } from "@/services/DocumentService";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseDocumentManagerProps {
  entityType: EntityType;
  entityId: string;
}

export const useDocumentManager = ({ entityType, entityId }: UseDocumentManagerProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Fetch documents
  const {
    data: documents = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["documents", entityType, entityId],
    queryFn: async () => {
      const response = await DocumentService.getDocuments(entityType, entityId);
      if (!response.success) {
        const errorMessage = typeof response.error === 'string' 
          ? response.error 
          : response.error?.message || t("errorFetchingDocuments");
        throw new Error(errorMessage);
      }
      return response.data;
    },
  });

  // Add document approval functionality
  const approveDocumentMutation = useMutation({
    mutationFn: async ({
      document,
      status,
      notes
    }: {
      document: Document;
      status: DocumentApprovalStatus;
      notes?: string;
    }) => {
      return DocumentService.approveDocument(document.id, status, notes);
    },
    onSuccess: () => {
      toast({
        title: t("documentStatusUpdated"),
        description: t("documentStatusUpdatedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["documents", entityType, entityId] });
    },
    onError: (error: any) => {
      toast({
        title: t("errorUpdatingDocumentStatus"),
        description: error?.message || t("unknownError"),
        variant: "destructive",
      });
    },
  });

  // Delete document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      setIsDeletingId(documentId);
      return DocumentService.deleteDocument(documentId);
    },
    onSuccess: () => {
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["documents", entityType, entityId] });
      setIsDeletingId(null);
    },
    onError: (error: any) => {
      toast({
        title: t("errorDeletingDocument"),
        description: error?.message || t("unknownError"),
        variant: "destructive",
      });
      setIsDeletingId(null);
    },
  });

  return {
    documents,
    isLoading,
    isError,
    error,
    refetch,
    deleteDocument: (documentId: string) => deleteDocumentMutation.mutate(documentId),
    isDeleting: deleteDocumentMutation.isPending,
    isDeletingId,
    approveDocument: (document: Document, status: DocumentApprovalStatus, notes?: string) =>
      approveDocumentMutation.mutate({ document, status, notes })
  };
};
