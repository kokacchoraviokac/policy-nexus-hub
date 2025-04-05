
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document, DocumentApprovalStatus, EntityType } from "@/types/documents";
import { fromDocumentTable } from "@/utils/supabaseTypeAssertions";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseDocumentManagerProps {
  entityType: EntityType;
  entityId: string;
}

export function useDocumentManager({ 
  entityType, 
  entityId 
}: UseDocumentManagerProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const tableName = getDocumentTableName(entityType);
  const entityIdField = `${entityType}_id`.replace('sales_process', 'sales_process');
  
  // Query to fetch documents
  const { 
    data: documents = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['documents', entityType, entityId],
    queryFn: async () => {
      try {
        const { data, error } = await fromDocumentTable(tableName)
          .select('*')
          .eq(entityIdField, entityId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return (data || []) as Document[];
      } catch (err) {
        console.error(`Error fetching ${entityType} documents:`, err);
        throw err;
      }
    }
  });
  
  // Mutation to delete a document
  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await fromDocumentTable(tableName)
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      return documentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast({
        title: t('documentDeleted'),
        description: t('documentDeletedSuccessfully'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('errorDeletingDocument'),
        description: error.message || t('unknownError'),
        variant: 'destructive',
      });
    }
  });
  
  // Mutation to update document approval status
  const approvalMutation = useMutation({
    mutationFn: async ({
      documentId,
      status,
      notes
    }: {
      documentId: string;
      status: DocumentApprovalStatus;
      notes?: string;
    }) => {
      const { data, error } = await fromDocumentTable(tableName)
        .update({
          approval_status: status,
          approval_notes: notes,
          approved_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast({
        title: t('documentApprovalUpdated'),
        description: t('documentApprovalUpdatedSuccessfully'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('errorUpdatingApproval'),
        description: error.message || t('unknownError'),
        variant: 'destructive',
      });
    }
  });
  
  return {
    documents,
    isLoading,
    isError: !!error,
    error,
    documentsCount: documents.length,
    refreshDocuments: refetch,
    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    updateDocumentApproval: approvalMutation.mutate,
    isApproving: approvalMutation.isPending
  };
}
