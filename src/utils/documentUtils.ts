
import { supabase } from "@/integrations/supabase/client";
import type { EntityType } from "@/utils/activityLogger";
import { Document } from "@/hooks/useDocuments";

export type DocumentTableName = "policy_documents" | "claim_documents" | "sales_documents";

// Helper function to map entity type to table name
export const entityTypeToTable = (entityType: EntityType): DocumentTableName => {
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
    const tableName = entityTypeToTable(entityType);
    
    // Create the field name dynamically based on entity type
    const fieldName = `${entityType}_id`;
    
    // Break the chain to avoid deep type recursion issues
    const tableQuery = supabase.from(tableName);
    
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
  documentId: string
): Promise<string> => {
  try {
    // First, get document details to delete the storage file
    const { data, error: fetchError } = await supabase
      .from('policy_documents')  // We'll check policy_documents first
      .select("*")
      .eq("id", documentId)
      .single();
      
    if (fetchError) {
      // If not found in policy_documents, try other document tables
      const tables: DocumentTableName[] = ['claim_documents', 'sales_documents'];
      let foundData = null;
      
      for (const table of tables) {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select("*")
          .eq("id", documentId)
          .single();
          
        if (!tableError && tableData) {
          foundData = tableData;
          break;
        }
      }
      
      if (!foundData) {
        throw new Error("Document not found");
      }
      
      // Use the found data
      if (foundData.file_path) {
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([foundData.file_path]);
          
        if (storageError) {
          console.error("Storage deletion error:", storageError);
        }
      }
      
      // Determine the table the document was found in and delete it
      for (const table of ['policy_documents', 'claim_documents', 'sales_documents'] as const) {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq("id", documentId);
          
        if (!deleteError) {
          // Successfully deleted
          break;
        }
      }
    } else {
      // Document found in policy_documents
      if (data.file_path) {
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([data.file_path]);
          
        if (storageError) {
          console.error("Storage deletion error:", storageError);
        }
      }
      
      // Delete document record
      const { error: dbError } = await supabase
        .from('policy_documents')
        .delete()
        .eq("id", documentId);
        
      if (dbError) {
        throw dbError;
      }
    }
    
    return documentId;
  } catch (err) {
    console.error("Error deleting document:", err);
    throw err;
  }
};
