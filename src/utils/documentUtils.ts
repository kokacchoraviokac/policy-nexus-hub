
import { supabase } from "@/integrations/supabase/client";
import type { EntityType } from "@/utils/activityLogger";
import { Document, DocumentTableName } from "@/types/documents";

// Helper function to get document table name
export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case "policy":
      return "policy_documents";
    case "claim":
      return "claim_documents";
    case "sales_process":
      return "sales_documents";
    default:
      return "policy_documents"; // fallback
  }
};

// Helper function to map DB row to Document interface
export const mapDocumentToModel = (doc: any, entityType: EntityType, entityId: string): Document => {
  return {
    id: doc.id,
    document_name: doc.document_name,
    document_type: doc.document_type,
    created_at: doc.created_at,
    file_path: doc.file_path,
    entity_type: entityType,
    entity_id: entityId,
    uploaded_by_id: doc.uploaded_by,
    uploaded_by_name: "Unknown", // We'll fetch this separately if needed
    version: doc.version || 1,
    is_latest_version: true,
    mime_type: doc.mime_type
  };
};

// Function to fetch documents from the database
export const fetchDocuments = async (
  entityType: EntityType, 
  entityId: string
): Promise<Document[]> => {
  try {
    // Get the appropriate document table name
    const documentTable = getDocumentTableName(entityType);
    
    // Create the field name dynamically based on entity type
    const fieldName = `${entityType}_id`;
    
    // Break the chain to avoid deep type recursion
    const tableQuery = supabase.from(documentTable);
    
    // Need to cast as any to avoid TypeScript recursion
    const query = tableQuery as any;
    
    // Apply the filter with proper type casting
    const { data, error } = await query
      .select("*")
      .eq(fieldName, entityId)
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    if (!data) return [];
    
    // Transform the response to match our Document interface
    return data.map((doc: any) => mapDocumentToModel(doc, entityType, entityId));
    
  } catch (err) {
    console.error("Error fetching documents:", err);
    throw err;
  }
};

// Function to delete a document and its associated file
export const deleteDocument = async (
  documentId: string,
  entityType: EntityType,
  entityId: string
): Promise<string> => {
  try {
    // Get the appropriate document table name
    const documentTable = getDocumentTableName(entityType);
    
    // First, get document details to delete the storage file
    const tableQuery = supabase.from(documentTable);
    const query = tableQuery as any;
    
    // Get document details
    const { data, error: fetchError } = await query
      .select("*")
      .eq("id", documentId)
      .single();
      
    if (fetchError || !data) {
      throw new Error("Document not found");
    }
    
    // Delete file from storage
    if (data.file_path) {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([data.file_path]);
        
      if (storageError) {
        throw storageError;
      }
    }
    
    // Delete document record - avoid deep type recursion
    const deleteQueryBase = supabase.from(documentTable);
    const deleteQuery = deleteQueryBase as any;
    
    const { error: dbError } = await deleteQuery
      .delete()
      .eq("id", documentId);
      
    if (dbError) {
      throw dbError;
    }
    
    return documentId;
  } catch (err) {
    console.error("Error deleting document:", err);
    throw err;
  }
};
