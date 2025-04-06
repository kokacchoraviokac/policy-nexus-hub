
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentTableName, PolicyDocument } from '@/types/documents';
import { EntityType } from '@/types/common';
import { fromDocumentTable } from '@/utils/supabaseTypeAssertions';
import { getDocumentTableName } from '@/utils/documentUploadUtils';

interface UseDocumentsReturn {
  documents: PolicyDocument[];
  isLoading: boolean;
  isError: boolean;
  error: Error;
  refetch: (options?: any) => Promise<any>;
  documentsCount: number;
  deleteDocument: (documentId: string) => void;
  isDeletingDocument: boolean;
  refresh: () => void;
  isRefetching?: boolean;
}

export function useDocuments(entityType: EntityType, entityId: string): UseDocumentsReturn {
  const queryClient = useQueryClient();
  const tableName = getDocumentTableName(entityType);
  
  const {
    data: documents = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['documents', entityType, entityId],
    queryFn: async () => {
      try {
        // Cast as any first to bypass TypeScript error with string literal type
        const query = fromDocumentTable(tableName as DocumentTableName)
          .select('*')
          .order('created_at', { ascending: false });

        // Apply condition based on entity type
        switch (entityType) {
          case EntityType.POLICY:
            query.eq('policy_id', entityId);
            break;
          case EntityType.CLAIM:
            query.eq('claim_id', entityId);
            break;
          case EntityType.SALES_PROCESS:
          case EntityType.SALE:
            query.eq('sales_process_id', entityId);
            break;
          case EntityType.CLIENT:
            query.eq('client_id', entityId);
            break;
          case EntityType.AGENT:
            query.eq('agent_id', entityId);
            break;
          case EntityType.INSURER:
            query.eq('insurer_id', entityId);
            break;
          case EntityType.ADDENDUM:
            query.eq('addendum_id', entityId);
            break;
          case EntityType.INVOICE:
            query.eq('invoice_id', entityId);
            break;
          default:
            console.warn(`Unsupported entity type: ${entityType}`);
            break;
        }

        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Transform the data to include full URLs
        return (data || []).map(doc => ({
          ...doc,
          file_path: doc.file_path.startsWith('http') 
            ? doc.file_path 
            : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${doc.file_path}`
        })) as PolicyDocument[];
      } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
    }
  });

  // Mutation for deleting a document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await fromDocumentTable(tableName as DocumentTableName)
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      return documentId;
    },
    onSuccess: () => {
      // Invalidate and refetch documents after successful deletion
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    }
  });

  // Compute the document count
  const documentsCount = documents?.length || 0;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
  };

  return {
    documents: documents as PolicyDocument[],
    isLoading,
    isError,
    error: error as Error,
    refetch,
    documentsCount,
    deleteDocument: deleteDocumentMutation.mutate,
    isDeletingDocument: deleteDocumentMutation.isPending,
    refresh,
    isRefetching
  };
}
