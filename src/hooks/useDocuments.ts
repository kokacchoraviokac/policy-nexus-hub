
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDocuments, deleteDocument } from "@/utils/documentUtils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import type { EntityType } from "@/utils/activityLogger";

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  entity_type?: EntityType;
  entity_id?: string;
  uploaded_by_id?: string;
  uploaded_by_name?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string;
  mime_type?: string;
  file_size?: number;
  tags?: string[];
}

export interface UseDocumentsProps {
  entityType: EntityType;
  entityId: string;
  enabled?: boolean;
}

export const useDocuments = ({ entityType, entityId, enabled = true }: UseDocumentsProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  
  // Query to fetch documents
  const {
    data: documents = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['documents', entityType, entityId],
    queryFn: () => fetchDocuments(entityType, entityId),
    enabled
  });
  
  // Mutation to delete document
  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      setIsDeletingDocument(true);
      try {
        return await deleteDocument(documentId, entityType, entityId);
      } finally {
        setIsDeletingDocument(false);
      }
    },
    onSuccess: () => {
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
      toast({
        title: t("documentDeleteError"),
        description: t("documentDeleteErrorMessage"),
        variant: "destructive",
      });
    }
  });
  
  const deleteDocument = async (documentId: string) => {
    return deleteMutation.mutate(documentId);
  };
  
  return {
    documents,
    isLoading,
    error,
    deleteDocument,
    isDeletingDocument
  };
};
