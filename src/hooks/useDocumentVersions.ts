
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";

export interface UseDocumentVersionsProps {
  documentId: string;
  originalDocumentId?: string;
  enabled?: boolean;
}

export const useDocumentVersions = ({ 
  documentId, 
  originalDocumentId,
  enabled = true 
}: UseDocumentVersionsProps) => {
  // We need to determine the base document ID to query versions
  const queryDocumentId = originalDocumentId || documentId;
  
  const {
    data: versions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['document-versions', queryDocumentId],
    queryFn: async () => {
      // First check if this document has an original ID
      let documentToQuery = queryDocumentId;
      
      if (!originalDocumentId) {
        // Check if this document is already a version of another document
        const { data: currentDoc } = await supabase
          .from('claim_documents')
          .select('original_document_id')
          .eq('id', documentId)
          .single();
          
        if (currentDoc?.original_document_id) {
          documentToQuery = currentDoc.original_document_id;
        }
      }
      
      // Get all versions including the original
      const { data: allVersions, error } = await supabase
        .from('claim_documents')
        .select('*')
        .or(`id.eq.${documentToQuery},original_document_id.eq.${documentToQuery}`)
        .order('version', { ascending: false });
        
      if (error) throw error;
      
      // Transform to Document type
      return (allVersions || []).map(doc => ({
        id: doc.id,
        document_name: doc.document_name,
        document_type: doc.document_type,
        created_at: doc.created_at,
        file_path: doc.file_path,
        entity_type: 'claim',
        entity_id: doc.claim_id,
        uploaded_by_id: doc.uploaded_by,
        version: doc.version,
        is_latest_version: doc.is_latest_version,
        original_document_id: doc.original_document_id,
        category: doc.category,
        approval_status: doc.approval_status,
        approval_notes: doc.approval_notes,
        approved_by: doc.approved_by,
        approved_at: doc.approved_at
      })) as Document[];
    },
    enabled: enabled && !!queryDocumentId
  });
  
  return {
    versions,
    isLoading,
    error,
    hasMultipleVersions: versions.length > 1
  };
};
