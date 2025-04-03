
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document, EntityType } from "@/types/documents";
import { DocumentService } from "@/services/DocumentService";
import { useApiService } from "./useApiService";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const deleteDocument = async (document: Document) => {
    return executeService(
      () => DocumentService.deleteDocument(document.id),
      {
        successMessage: t("documentDeletedSuccessfully"),
        errorMessage: t("errorDeletingDocument"),
        invalidateQueryKeys: [['documents', entityType, entityId]]
      }
    );
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
  };
};
