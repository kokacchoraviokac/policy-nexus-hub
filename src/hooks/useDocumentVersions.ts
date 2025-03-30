
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";

export interface UseDocumentVersionsProps {
  documentId: string;
  originalDocumentId?: string;
  enabled?: boolean;
}

// Define a type for document database row with only the fields we need
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
  category?: string | null;
  mime_type?: string | null;
  // Using indexed access type instead of string index signature
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
        let documentData: Record<string, any> | null = null;
        let entityType: string = '';
        let entityId: string = '';
        
        // Check policy_documents
        const { data: policyDoc, error: policyError } = await supabase
          .from('policy_documents')
          .select('id, policy_id')
          .eq('id', queryDocumentId)
          .single();
          
        if (!policyError && policyDoc) {
          documentData = policyDoc;
          entityType = 'policy';
          entityId = policyDoc.policy_id;
        } else {
          // Check claim_documents if not found in policy_documents
          const { data: claimDoc, error: claimError } = await supabase
            .from('claim_documents')
            .select('id, claim_id')
            .eq('id', queryDocumentId)
            .single();
            
          if (!claimError && claimDoc) {
            documentData = claimDoc;
            entityType = 'claim';
            entityId = claimDoc.claim_id;
          } else {
            // Check sales_documents if not found in others
            const { data: salesDoc, error: salesError } = await supabase
              .from('sales_documents')
              .select('id, sales_process_id')
              .eq('id', queryDocumentId)
              .single();
              
            if (!salesError && salesDoc) {
              documentData = salesDoc;
              entityType = 'sales_process';
              entityId = salesDoc.sales_process_id;
            } else {
              // Document not found in any table
              throw new Error("Document not found");
            }
          }
        }
        
        if (!documentData || !entityType || !entityId) {
          throw new Error("Could not determine document type");
        }
        
        // Get appropriate table name
        const tableName = entityType === 'policy' 
          ? 'policy_documents' 
          : entityType === 'claim' 
            ? 'claim_documents' 
            : 'sales_documents';
        
        // Get id field name for the entity
        const entityField = entityType === 'policy' 
          ? 'policy_id' 
          : entityType === 'claim' 
            ? 'claim_id' 
            : 'sales_process_id';
            
        // Get original document ID if available
        let originalId = originalDocumentId;
        
        if (!originalId) {
          // Check if this document has an original_document_id
          const { data: docInfo, error: docError } = await supabase
            .from(tableName)
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
        
        // Avoid deep type issues with query construction
        const { data: allVersions, error: versionsError } = await supabase
          .from(tableName)
          .select('*')
          .eq(entityField, entityId)
          .or(`original_document_id.eq.${originalId},id.eq.${originalId}`)
          .order('version', { ascending: false });
        
        if (versionsError) throw versionsError;
        
        // Transform to Document type, safely handling potentially missing properties
        return (allVersions || []).map((doc: DocumentDbRow) => {
          // Get the entity ID from the appropriate field
          const docEntityId = entityType === 'policy' 
            ? doc.policy_id 
            : entityType === 'claim' 
              ? doc.claim_id 
              : doc.sales_process_id;
          
          return {
            id: doc.id,
            document_name: doc.document_name,
            document_type: doc.document_type,
            created_at: doc.created_at,
            file_path: doc.file_path,
            entity_type: entityType,
            entity_id: docEntityId,
            uploaded_by_id: doc.uploaded_by,
            // Handle potentially missing properties with default values
            version: doc.version || 1,
            is_latest_version: doc.is_latest_version || false,
            original_document_id: doc.original_document_id || null,
            category: doc.category || null,
            approval_status: 'pending', // Default, will be fetched from activity logs if needed
            mime_type: doc.mime_type || null
          };
        }) as Document[];
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
