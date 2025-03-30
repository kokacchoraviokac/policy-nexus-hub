
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentCategory } from "@/types/documents";

export interface UseDocumentVersionsProps {
  documentId: string;
  originalDocumentId?: string;
  enabled?: boolean;
}

// Define explicit table names to avoid string type errors
type DocumentTableName = 'policy_documents' | 'claim_documents' | 'sales_documents';

// Define a simplified type for document database row with only the fields we need
interface DocumentDbRow {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  uploaded_by: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string | null;
  category?: DocumentCategory | null;
  mime_type?: string | null;
  policy_id?: string;
  claim_id?: string;
  sales_process_id?: string;
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
      try {
        // First determine the document table and entity information
        const tables: DocumentTableName[] = ['policy_documents', 'claim_documents', 'sales_documents'];
        let entityType = '';
        let entityId = '';
        let tableName: DocumentTableName | null = null;
        let entityField = '';
        
        // Check each table for the document
        for (const table of tables) {
          // Type-safe query using known table names
          const query = supabase.from(table as DocumentTableName);
          
          const { data, error } = await query
            .select(table === 'policy_documents' 
              ? 'id, policy_id' 
              : table === 'claim_documents' 
                ? 'id, claim_id' 
                : 'id, sales_process_id')
            .eq('id', queryDocumentId)
            .single();
            
          if (!error && data) {
            tableName = table;
            entityType = table === 'policy_documents' 
              ? 'policy' 
              : table === 'claim_documents' 
                ? 'claim' 
                : 'sales_process';
            entityField = entityType === 'policy' 
              ? 'policy_id' 
              : entityType === 'claim' 
                ? 'claim_id' 
                : 'sales_process_id';
            entityId = data[entityField];
            break;
          }
        }
        
        if (!tableName || !entityType || !entityId) {
          throw new Error("Document not found or could not determine document type");
        }
        
        // Get original document ID if available
        let originalId = originalDocumentId;
        
        if (!originalId) {
          // Check if this document has an original_document_id
          const query = supabase.from(tableName);
          const { data: docInfo, error: docError } = await query
            .select('original_document_id')
            .eq('id', documentId)
            .single();
            
          if (!docError && docInfo && docInfo.original_document_id) {
            originalId = docInfo.original_document_id;
          } else {
            // This might be the original document itself
            originalId = documentId;
          }
        }
        
        // Query for all versions using the type-safe table name
        const query = supabase.from(tableName);
        
        // Use separate filters to avoid the deep instantiation error
        const { data: allVersions, error: versionsError } = await query
          .select('*')
          .eq(entityField, entityId)
          .or(`original_document_id.eq.${originalId},id.eq.${originalId}`);
        
        if (versionsError) throw versionsError;
        
        // Transform to Document type with explicit type safety
        if (!allVersions) return [];
        
        // We need to type cast because the query can't guarantee DocumentDbRow
        const result = allVersions.map((rawDoc: any) => {
          const doc = rawDoc as DocumentDbRow;
          
          return {
            id: doc.id,
            document_name: doc.document_name,
            document_type: doc.document_type,
            created_at: doc.created_at,
            file_path: doc.file_path,
            entity_type: entityType,
            entity_id: entityType === 'policy' 
              ? doc.policy_id 
              : entityType === 'claim' 
                ? doc.claim_id 
                : doc.sales_process_id,
            uploaded_by_id: doc.uploaded_by,
            version: doc.version || 1,
            is_latest_version: doc.is_latest_version || false,
            original_document_id: doc.original_document_id || null,
            category: doc.category || null,
            approval_status: 'pending',
            mime_type: doc.mime_type || null
          } as Document;
        });
        
        return result;
      } catch (error) {
        console.error("Error fetching document versions:", error);
        return [];
      }
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
