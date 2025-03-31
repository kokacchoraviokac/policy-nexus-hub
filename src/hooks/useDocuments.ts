
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Document, UseDocumentsProps } from "@/types/documents";

export const useDocuments = ({ entityType, entityId, enabled = true }: UseDocumentsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  
  // Map entity type to the table name
  const getTableName = () => {
    switch (entityType) {
      case 'policy':
        return 'policy_documents';
      case 'claim':
        return 'claim_documents';
      case 'sales_process':
        return 'sales_documents';
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  };
  
  // Map entity type to the entity ID column name
  const getEntityIdColumn = () => {
    switch (entityType) {
      case 'policy':
        return 'policy_id';
      case 'claim':
        return 'claim_id';
      case 'sales_process':
        return 'sales_process_id';
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  };
  
  const tableName = getTableName();
  const entityIdColumn = getEntityIdColumn();
  
  // Fetch documents for the specified entity
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`${entityType}-documents`, entityId],
    queryFn: async () => {
      if (!entityId) return [];
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*, profiles:uploaded_by(name)')
        .eq(entityIdColumn, entityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform database rows to Document interface
      return data.map((doc) => ({
        id: doc.id,
        document_name: doc.document_name,
        document_type: doc.document_type,
        created_at: doc.created_at,
        file_path: doc.file_path,
        entity_type: entityType,
        entity_id: entityId,
        uploaded_by_id: doc.uploaded_by,
        uploaded_by_name: doc.profiles?.name,
        version: doc.version || 1,
        is_latest_version: doc.is_latest_version === undefined ? true : doc.is_latest_version,
        original_document_id: doc.original_document_id,
        mime_type: doc.mime_type,
        category: doc.category
      }));
    },
    enabled: enabled && !!entityId
  });
  
  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      setIsDeletingDocument(true);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      return documentId;
    },
    onSuccess: () => {
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccessfully")
      });
      
      // Invalidate queries to refresh the documents list
      queryClient.invalidateQueries({
        queryKey: [`${entityType}-documents`, entityId]
      });
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
      toast({
        title: t("errorDeletingDocument"),
        description: t("errorOccurredTryAgain"),
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsDeletingDocument(false);
    }
  });
  
  const deleteDocument = (documentId: string) => {
    deleteDocumentMutation.mutate(documentId);
  };
  
  return {
    documents: data || [],
    isLoading,
    error,
    refetch,
    deleteDocument,
    isDeletingDocument
  };
};
