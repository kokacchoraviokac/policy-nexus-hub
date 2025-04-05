
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentCategory } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";

// Define explicit table names to avoid string type errors
const DOCUMENT_TABLES = ['policy_documents', 'claim_documents', 'sales_documents'] as const;
export type DocumentTableName = typeof DOCUMENT_TABLES[number];

// Define a simplified type for document database row with only the fields we need
export interface DocumentDbRow {
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
export interface DocumentEntityInfo {
  tableName: DocumentTableName;
  entityType: 'policy' | 'claim' | 'sales_process';
  entityId: string;
}

// Helper function to find the document table and entity information
export async function findDocumentInfo(documentId: string): Promise<DocumentEntityInfo | null> {
  // Check policy_documents
  // Break the chain with intermediate variables to avoid deep type instantiation
  const policyQuery = supabase
    .from('policy_documents')
    .select('id, policy_id')
    .eq('id', documentId)
    .limit(1);
    
  const { data: policyDoc, error: policyError } = await policyQuery.single();
    
  if (!policyError && policyDoc) {
    return {
      tableName: 'policy_documents',
      entityType: 'policy',
      entityId: policyDoc.policy_id
    };
  }
  
  // Check claim_documents
  const claimQuery = supabase
    .from('claim_documents')
    .select('id, claim_id')
    .eq('id', documentId)
    .limit(1);
    
  const { data: claimDoc, error: claimError } = await claimQuery.single();
    
  if (!claimError && claimDoc) {
    return {
      tableName: 'claim_documents',
      entityType: 'claim',
      entityId: claimDoc.claim_id
    };
  }
  
  // Check sales_documents
  const salesQuery = supabase
    .from('sales_documents')
    .select('id, sales_process_id')
    .eq('id', documentId)
    .limit(1);
    
  const { data: salesDoc, error: salesError } = await salesQuery.single();
    
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
export async function findOriginalDocumentId(documentId: string, tableName: DocumentTableName): Promise<string | null> {
  // Break the chain with intermediate variables
  const query = supabase
    .from(tableName)
    .select('original_document_id')
    .eq('id', documentId);
    
  const { data: docInfo } = await query.single();
    
  return docInfo?.original_document_id || null;
}

// Helper function to fetch all versions
export async function fetchAllVersions(documentId: string, info: DocumentEntityInfo): Promise<DocumentDbRow[]> {
  const { tableName, entityType, entityId } = info;
  
  let idColumn: string;
  if (entityType === 'policy') {
    idColumn = 'policy_id';
  } else if (entityType === 'claim') {
    idColumn = 'claim_id';
  } else {
    idColumn = 'sales_process_id';
  }
  
  // Break the chain by using intermediate variables and type assertions
  // This prevents TypeScript from trying to infer the full chain depth
  const baseQuery = supabase.from(tableName);
  
  // Use type assertion to prevent deep type instantiation
  const query = baseQuery as any;
  
  const { data } = await query
    .select('*')
    .eq(idColumn, entityId)
    .or(`original_document_id.eq.${documentId},id.eq.${documentId}`);
    
  // Explicitly cast the result to our expected type
  return (data || []) as DocumentDbRow[];
}

// Helper function to transform DB rows to Document objects
export function transformToDocuments(documents: DocumentDbRow[], entityType: 'policy' | 'claim' | 'sales_process'): Document[] {
  return documents.map((doc: DocumentDbRow) => {
    let entityId: string | undefined;
    
    if (entityType === 'policy') {
      entityId = doc.policy_id;
    } else if (entityType === 'claim') {
      entityId = doc.claim_id;
    } else {
      entityId = doc.sales_process_id;
    }
    
    // Use type assertion to ensure compatibility with Document interface
    return {
      id: doc.id,
      document_name: doc.document_name,
      document_type: doc.document_type,
      created_at: doc.created_at,
      file_path: doc.file_path,
      entity_type: entityType,
      entity_id: entityId || "",
      uploaded_by: doc.uploaded_by,
      company_id: "", // This will be filled in by the database trigger
      uploaded_by_name: "Unknown User", // This could be fetched separately if needed
      version: doc.version || 1,
      is_latest_version: doc.is_latest_version || false,
      original_document_id: doc.original_document_id || null,
      category: doc.category || "other",
      mime_type: doc.mime_type || null,
      updated_at: doc.created_at // Default to created_at if updated_at is not available
    } as Document;
  });
}

// Main function to fetch document versions
export async function getDocumentVersions(documentId: string, originalDocumentId?: string): Promise<Document[]> {
  try {
    // Get the query document ID (either the original or current)
    const queryDocumentId = originalDocumentId || documentId;
    
    // Find the document table and entity information
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
}
