
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
        // First find document table and entity information
        let entityType = '';
        let entityId = '';
        let tableName: DocumentTableName | null = null;
        
        // Check policy_documents
        const { data: policyDoc, error: policyError } = await supabase
          .from('policy_documents')
          .select('id, policy_id')
          .eq('id', queryDocumentId)
          .limit(1)
          .single();
          
        if (!policyError && policyDoc) {
          tableName = 'policy_documents';
          entityType = 'policy';
          entityId = policyDoc.policy_id;
        } else {
          // Check claim_documents
          const { data: claimDoc, error: claimError } = await supabase
            .from('claim_documents')
            .select('id, claim_id')
            .eq('id', queryDocumentId)
            .limit(1)
            .single();
            
          if (!claimError && claimDoc) {
            tableName = 'claim_documents';
            entityType = 'claim';
            entityId = claimDoc.claim_id;
          } else {
            // Check sales_documents
            const { data: salesDoc, error: salesError } = await supabase
              .from('sales_documents')
              .select('id, sales_process_id')
              .eq('id', queryDocumentId)
              .limit(1)
              .single();
              
            if (!salesError && salesDoc) {
              tableName = 'sales_documents';
              entityType = 'sales_process';
              entityId = salesDoc.sales_process_id;
            }
          }
        }
        
        if (!tableName || !entityType || !entityId) {
          throw new Error("Document not found or could not determine document type");
        }
        
        // Get original document ID if needed
        let originalId = originalDocumentId;
        
        if (!originalId) {
          if (tableName === 'policy_documents') {
            const { data: docInfo } = await supabase
              .from('policy_documents')
              .select('original_document_id')
              .eq('id', documentId)
              .single();
              
            originalId = docInfo?.original_document_id || documentId;
          } else if (tableName === 'claim_documents') {
            const { data: docInfo } = await supabase
              .from('claim_documents')
              .select('original_document_id')
              .eq('id', documentId)
              .single();
              
            originalId = docInfo?.original_document_id || documentId;
          } else if (tableName === 'sales_documents') {
            const { data: docInfo } = await supabase
              .from('sales_documents')
              .select('original_document_id')
              .eq('id', documentId)
              .single();
              
            originalId = docInfo?.original_document_id || documentId;
          }
        }
        
        // Use separate queries for each table to avoid type issues
        let allVersions: DocumentDbRow[] = [];
        
        if (tableName === 'policy_documents') {
          const { data } = await supabase
            .from('policy_documents')
            .select('*')
            .eq('policy_id', entityId)
            .or(`original_document_id.eq.${originalId || documentId},id.eq.${originalId || documentId}`);
            
          if (data) {
            allVersions = data as DocumentDbRow[];
          }
        } else if (tableName === 'claim_documents') {
          const { data } = await supabase
            .from('claim_documents')
            .select('*')
            .eq('claim_id', entityId)
            .or(`original_document_id.eq.${originalId || documentId},id.eq.${originalId || documentId}`);
            
          if (data) {
            allVersions = data as DocumentDbRow[];
          }
        } else if (tableName === 'sales_documents') {
          const { data } = await supabase
            .from('sales_documents')
            .select('*')
            .eq('sales_process_id', entityId)
            .or(`original_document_id.eq.${originalId || documentId},id.eq.${originalId || documentId}`);
            
          if (data) {
            allVersions = data as DocumentDbRow[];
          }
        }
        
        // Transform to Document type
        return allVersions.map((doc: DocumentDbRow) => {
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
