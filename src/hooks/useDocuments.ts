
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document, EntityType } from "@/types/documents";

export const useDocuments = (entityType: EntityType, entityId: string) => {
  return useQuery({
    queryKey: ['documents', entityType, entityId],
    queryFn: async (): Promise<Document[]> => {
      let tableName = '';
      
      switch (entityType) {
        case 'policy':
          tableName = 'policy_documents';
          break;
        case 'claim':
          tableName = 'claim_documents';
          break;
        case 'client':
          tableName = 'client_documents';
          break;
        case 'invoice':
          tableName = 'invoice_documents';
          break;
        case 'addendum':
          tableName = 'addendum_documents';
          break;
        default:
          throw new Error(`Unsupported entity type: ${entityType}`);
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .select(`
          id,
          document_name,
          document_type,
          created_at,
          file_path,
          entity_id,
          uploaded_by_id,
          uploaded_by:uploaded_by_id (
            full_name
          ),
          description,
          version,
          status,
          tags,
          category
        `)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching ${entityType} documents:`, error);
        throw error;
      }
      
      return data.map(doc => ({
        id: doc.id,
        document_name: doc.document_name,
        document_type: doc.document_type,
        created_at: doc.created_at,
        file_path: doc.file_path,
        entity_type: entityType,
        entity_id: doc.entity_id,
        uploaded_by_id: doc.uploaded_by_id,
        uploaded_by_name: doc.uploaded_by?.full_name || 'Unknown User',
        description: doc.description,
        version: doc.version || 1,
        status: doc.status,
        tags: doc.tags,
        category: (doc.category || 'other') as Document['category']
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useDocuments;
