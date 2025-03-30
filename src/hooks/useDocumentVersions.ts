
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

// Define a simplified document entity mapping type
interface DocumentEntityInfo {
  tableName: DocumentTableName;
  entityType: 'policy' | 'claim' | 'sales_process';
  entityId: string;
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
        // Find the document table and entity information first
        const documentInfo = await findDocumentInfo(queryDocumentId);
        
        if (!documentInfo) {
          throw new Error("Document not found or could not determine document type");
        }
        
        // Get original document ID if needed
        const resolvedOriginalId = originalDocumentId || await findOriginalDocumentId(documentId, documentInfo.tableName);
        const finalQueryId = resolvedOriginalId || documentId;
        
        // Get all versions based on the document info we found
        const allVersions = await fetchAllVersions(finalQueryId, documentInfo);
        
        // Transform to Document type
        return transformToDocuments(allVersions, documentInfo.entityType);
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

// Helper function to find the document table and entity information
async function findDocumentInfo(documentId: string): Promise<DocumentEntityInfo | null> {
  // Check policy_documents
  const { data: policyDoc, error: policyError } = await supabase
    .from('policy_documents')
    .select('id, policy_id')
    .eq('id', documentId)
    .limit(1)
    .single();
    
  if (!policyError && policyDoc) {
    return {
      tableName: 'policy_documents',
      entityType: 'policy',
      entityId: policyDoc.policy_id
    };
  }
  
  // Check claim_documents
  const { data: claimDoc, error: claimError } = await supabase
    .from('claim_documents')
    .select('id, claim_id')
    .eq('id', documentId)
    .limit(1)
    .single();
    
  if (!claimError && claimDoc) {
    return {
      tableName: 'claim_documents',
      entityType: 'claim',
      entityId: claimDoc.claim_id
    };
  }
  
  // Check sales_documents
  const { data: salesDoc, error: salesError } = await supabase
    .from('sales_documents')
    .select('id, sales_process_id')
    .eq('id', documentId)
    .limit(1)
    .single();
    
  if (!salesError && salesDoc) {
    return {
      tableName: 'sales_documents',
      entityType: 'sales_process',
      entityId: salesDoc.sales_process_id
    };
  }
  
  return null;
}

// Helper function to find the original document ID
async function findOriginalDocumentId(documentId: string, tableName: DocumentTableName): Promise<string | null> {
  const { data: docInfo } = await supabase
    .from(tableName)
    .select('original_document_id')
    .eq('id', documentId)
    .single();
    
  return docInfo?.original_document_id || null;
}

// Helper function to fetch all versions
async function fetchAllVersions(documentId: string, info: DocumentEntityInfo): Promise<DocumentDbRow[]> {
  const { tableName, entityType, entityId } = info;
  
  const { data } = await supabase
    .from(tableName)
    .select('*')
    .eq(entityType === 'policy' ? 'policy_id' : entityType === 'claim' ? 'claim_id' : 'sales_process_id', entityId)
    .or(`original_document_id.eq.${documentId},id.eq.${documentId}`);
    
  return (data || []) as DocumentDbRow[];
}

// Helper function to transform DB rows to Document objects
function transformToDocuments(documents: DocumentDbRow[], entityType: 'policy' | 'claim' | 'sales_process'): Document[] {
  return documents.map((doc: DocumentDbRow) => {
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
}
