
import { useQuery, useMutation, UseQueryResult } from "@tanstack/react-query";
import { EntityType, ApprovalStatus } from "@/types/common";
import { Document, DocumentApprovalStatus } from "@/types/documents";
import { useDocuments } from "@/hooks/useDocuments";
import { useDocumentApproval } from "@/hooks/useDocumentApproval";

/**
 * A unified hook for document management operations
 */
export function useDocumentManager({
  entityType,
  entityId,
}: {
  entityType: EntityType;
  entityId: string;
}) {
  // Use the base documents hook for fetching, refreshing
  const {
    documents,
    isLoading,
    isError,
    error,
    refetch: refreshDocuments,
    deleteDocument,
    isDeleting
  } = useDocuments(entityType, entityId);

  // Use the document approval hook for approval operations
  const { 
    updateDocumentApproval,
    isUpdatingApproval
  } = useDocumentApproval();

  return {
    documents,
    isLoading,
    isError,
    error,
    deleteDocument,
    updateDocumentApproval,
    isDeleting,
    isUpdatingApproval,
    refreshDocuments,
    refetch: refreshDocuments,
  };
}
