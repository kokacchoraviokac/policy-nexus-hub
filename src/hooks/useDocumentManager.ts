
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document, EntityType, DocumentApprovalStatus } from "@/types/documents";
import { DocumentService } from "@/services/DocumentService";
import { useApiService } from "./useApiService";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface UseDocumentManagerProps {
  entityType: EntityType;
  entityId: string;
}

/**
 * Hook for managing documents for a specific entity
 */
export const useDocumentManager = ({ entityType, entityId }: UseDocumentManagerProps) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { handleApiError } = useApiService();

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
      try {
        const response = await DocumentService.getDocuments(entityType, entityId);
        if (!response.success) {
          throw response.error || new Error("Failed to fetch documents");
        }
        return response.data || [];
      } catch (err) {
        const error = handleApiError(err as any);
        throw error;
      }
    },
    enabled: !!entityId,
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      try {
        const response = await DocumentService.deleteDocument(documentId, entityType);
        if (!response.success) {
          throw response.error || new Error("Failed to delete document");
        }
        return response.data;
      } catch (err) {
        const error = handleApiError(err as any);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(t("documentDeletedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    },
    onError: (error: Error) => {
      toast.error(t("errorDeletingDocument"));
      console.error("Error deleting document:", error);
    }
  });

  // Fetch document versions
  const getDocumentVersions = async (documentId: string) => {
    try {
      const response = await DocumentService.getDocumentVersions(documentId, entityType);
      if (!response.success) {
        toast.error(t("errorFetchingDocumentVersions"));
        throw response.error || new Error("Failed to fetch document versions");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching document versions:", error);
      return [];
    }
  };

  // Update document approval status
  const updateDocumentApproval = async (
    documentId: string, 
    status: DocumentApprovalStatus, 
    notes?: string
  ) => {
    try {
      const response = await DocumentService.updateDocumentApproval(
        documentId,
        entityType,
        status,
        notes || "",
        "user-id" // Replace with actual user ID
      );
      
      if (!response.success) {
        toast.error(t("errorUpdatingDocumentStatus"));
        throw response.error || new Error("Failed to update document status");
      }
      
      toast.success(t("documentStatusUpdateSuccess"));
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      return response.data;
    } catch (error) {
      console.error("Error updating document approval:", error);
      return null;
    }
  };

  return {
    documents,
    isLoading,
    isError,
    error,
    refetch,
    selectedDocument,
    setSelectedDocument,
    deleteDocument: deleteDocumentMutation.mutate,
    getDocumentVersions,
    isDeletingDocument: deleteDocumentMutation.isPending,
    updateDocumentApproval
  };
};
