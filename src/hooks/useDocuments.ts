
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseDocumentsParams {
  entityType: EntityType;
  entityId: string;
}

export const useDocuments = ({ entityType, entityId }: UseDocumentsParams) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Get the table name based on entity type
  const tableName = getDocumentTableName(entityType);
  
  // Query to fetch documents
  const documentsQuery = useQuery({
    queryKey: ['documents', entityType, entityId],
    queryFn: async (): Promise<Document[]> => {
      try {
        // Use explicit casting to handle type issues with Supabase
        const { data, error } = await supabase
          .from(tableName)
          .select(`
            id,
            document_name,
            document_type,
            created_at,
            file_path,
            entity_id,
            uploaded_by,
            description,
            version,
            status,
            tags,
            category,
            mime_type,
            is_latest_version,
            original_document_id
          `)
          .eq('entity_id', entityId)
          .order('created_at', { ascending: false });
      
        if (error) {
          console.error(`Error fetching ${entityType} documents:`, error);
          throw error;
        }
      
        // Map the data to Document type
        return (data || []).map(doc => ({
          id: doc.id,
          document_name: doc.document_name,
          document_type: doc.document_type,
          created_at: doc.created_at,
          file_path: doc.file_path,
          entity_type: entityType,
          entity_id: doc.entity_id,
          uploaded_by_id: doc.uploaded_by,
          uploaded_by_name: 'Unknown User', // This would need to be fetched separately
          description: doc.description,
          version: doc.version || 1,
          status: doc.status,
          tags: doc.tags,
          category: (doc.category || 'other') as DocumentCategory,
          mime_type: doc.mime_type,
          is_latest_version: doc.is_latest_version,
          original_document_id: doc.original_document_id,
          // Add approval fields with default values to match Document type
          approval_status: "pending",
          approved_by: undefined,
          approved_at: undefined,
          approval_notes: undefined
        }));
      } catch (error) {
        console.error(`Error in document query:`, error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Mutation to delete a document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      try {
        // First fetch the document to get file_path
        const { data, error: fetchError } = await supabase
          .from(tableName)
          .select('file_path')
          .eq('id', documentId)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Delete the record
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .eq('id', documentId);
          
        if (deleteError) throw deleteError;
        
        // Also delete from storage if file path exists
        if (data && data.file_path) {
          await supabase.storage
            .from('documents')
            .remove([data.file_path]);
        }
        
        return { success: true };
      } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccessfully")
      });
      
      queryClient.invalidateQueries({
        queryKey: ['documents', entityType, entityId]
      });
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
      toast({
        title: t("errorDeletingDocument"),
        description: t("errorOccurred"),
        variant: "destructive"
      });
    }
  });
  
  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    error: documentsQuery.error,
    deleteDocument: deleteDocumentMutation.mutate,
    isDeletingDocument: deleteDocumentMutation.isPending
  };
};

export default useDocuments;
