
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document, EntityType } from "@/types/documents";
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
  const { executeService } = useApiService();

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
      const response = await DocumentService.getDocuments(entityType, entityId);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch documents");
      }
      return response.data || [];
    },
    enabled: !!entityId,
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (document: Document) => {
      return executeService(
        () => DocumentService.deleteDocument(document.id),
        {
          successMessage: t("documentDeletedSuccessfully"),
          errorMessage: t("errorDeletingDocument"),
          invalidateQueryKeys: [['documents', entityType, entityId]]
        }
      );
    }
  });

  const deleteDocument = (document: Document) => {
    deleteDocumentMutation.mutate(document);
  };

  // Fetch document versions
  const getDocumentVersions = async (documentId: string) => {
    return executeService(
      () => DocumentService.getDocumentVersions(documentId),
      {
        errorMessage: t("errorFetchingDocumentVersions")
      }
    );
  };

  // Update document approval status
  const updateDocumentApproval = async (
    documentId: string, 
    status: string, 
    notes?: string
  ) => {
    try {
      // Implementation will depend on how your DocumentService is structured
      // This is a placeholder implementation
      const result = await executeService(
        () => DocumentService.updateDocumentStatus(documentId, status, notes),
        {
          successMessage: t("documentStatusUpdateSuccess"),
          errorMessage: t("errorUpdatingDocumentStatus"),
          invalidateQueryKeys: [['documents', entityType, entityId]]
        }
      );
      
      return result;
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
    deleteDocument,
    getDocumentVersions,
    isDeleting: deleteDocumentMutation.isPending,
    updateDocumentApproval
  };
};
