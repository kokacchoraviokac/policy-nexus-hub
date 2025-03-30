
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
      let documentFound = false;
      
      // Get all versions including the original - only query basic fields that are guaranteed to exist
      const { data: allVersions, error } = await supabase
        .from('claim_documents')
        .select('id, document_name, document_type, created_at, file_path, claim_id, uploaded_by, updated_at, company_id')
        .eq('id', documentToQuery)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform to Document type with only the fields we know exist
      return (allVersions || []).map(doc => ({
        id: doc.id,
        document_name: doc.document_name,
        document_type: doc.document_type,
        created_at: doc.created_at,
        file_path: doc.file_path,
        entity_type: 'claim',
        entity_id: doc.claim_id,
        uploaded_by_id: doc.uploaded_by
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
