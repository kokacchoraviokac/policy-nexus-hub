import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import { v4 as uuidv4 } from "uuid";

// Define the document tables as constant string literals to avoid type recursion
const POLICY_DOCUMENTS = 'policy_documents';
const CLAIM_DOCUMENTS = 'claim_documents';
const SALES_DOCUMENTS = 'sales_documents';

// Define the document tables mapping for easier reuse
export type DocumentTableName = typeof POLICY_DOCUMENTS | typeof CLAIM_DOCUMENTS | typeof SALES_DOCUMENTS;

// Define the entity ID field mapping
const ENTITY_ID_FIELD_MAP: Record<EntityType, string> = {
  'policy': 'policy_id',
  'claim': 'claim_id',
  'sales_process': 'sales_process_id',
  'client': 'policy_id', // These will need proper fields in future
  'invoice': 'policy_id', // These will need proper fields in future
  'addendum': 'addendum_id',
  'agent': 'policy_id',   // These will need proper fields in future
  'insurer': 'policy_id'  // These will need proper fields in future
};

// Map EntityType to their respective table names
const DOCUMENT_TABLE_MAP: Record<EntityType, DocumentTableName> = {
  'policy': POLICY_DOCUMENTS,
  'claim': CLAIM_DOCUMENTS,
  'sales_process': SALES_DOCUMENTS,
  'client': POLICY_DOCUMENTS, // These will need proper tables in future
  'invoice': POLICY_DOCUMENTS, // These will need proper tables in future
  'addendum': POLICY_DOCUMENTS, // These will need proper tables in future
  'agent': POLICY_DOCUMENTS,    // These will need proper tables in future
  'insurer': POLICY_DOCUMENTS   // These will need proper tables in future
};

interface DocumentUploadOptions {
  file: File;
  documentName: string;
  documentType: string;
  category: DocumentCategory | string;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
  additionalData?: Record<string, any>;
}

export class DocumentService {
  /**
   * Upload a document to storage and create a database record
   */
  static async uploadDocument(options: DocumentUploadOptions): Promise<{ success: boolean; data?: any; error?: any }> {
    const { 
      file, 
      documentName, 
      documentType, 
      category, 
      entityId, 
      entityType,
      originalDocumentId,
      currentVersion = 0,
      additionalData = {}
    } = options;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `documents/${entityType}/${entityId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        throw uploadError;
      }

      // Determine table name and ID field based on entity type
      const tableName = DOCUMENT_TABLE_MAP[entityType];
      const entityIdField = ENTITY_ID_FIELD_MAP[entityType];

      // Calculate new version if it's a version update
      const version = currentVersion > 0 ? currentVersion + 1 : 1;

      // Create document record with appropriate fields
      let documentData: any = {
        document_name: documentName,
        document_type: documentType,
        file_path: filePath,
        uploaded_by: user.id,
        company_id: user?.user_metadata?.company_id,
        category: category,
        version: version,
        is_latest_version: true,
        mime_type: file.type,
        original_document_id: originalDocumentId || null,
        ...additionalData
      };

      // Set the appropriate entity ID field based on the table
      documentData[entityIdField] = entityId;

      // Insert the document record - Using explicit table name to avoid type recursion
      let query;
      if (tableName === POLICY_DOCUMENTS) {
        query = supabase.from(POLICY_DOCUMENTS);
      } else if (tableName === CLAIM_DOCUMENTS) {
        query = supabase.from(CLAIM_DOCUMENTS);
      } else if (tableName === SALES_DOCUMENTS) {
        query = supabase.from(SALES_DOCUMENTS);
      } else {
        throw new Error(`Unsupported document table: ${tableName}`);
      }
      
      const { data, error: dbError } = await query
        .insert(documentData)
        .select()
        .single();

      if (dbError) {
        console.error("Error creating document record:", dbError);
        
        // Try to clean up the uploaded file on db error
        await supabase.storage
          .from('documents')
          .remove([filePath]);
          
        throw dbError;
      }

      // If this is a new version, update previous version
      if (originalDocumentId) {
        let updateQuery;
        if (tableName === POLICY_DOCUMENTS) {
          updateQuery = supabase.from(POLICY_DOCUMENTS);
        } else if (tableName === CLAIM_DOCUMENTS) {
          updateQuery = supabase.from(CLAIM_DOCUMENTS);
        } else if (tableName === SALES_DOCUMENTS) {
          updateQuery = supabase.from(SALES_DOCUMENTS);
        }
        
        await updateQuery
          .update({ is_latest_version: false })
          .eq('id', originalDocumentId);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Document upload failed:", error);
      return { success: false, error };
    }
  }

  /**
   * Fetch documents for an entity
   */
  static async fetchDocuments(entityType: EntityType, entityId: string): Promise<Document[]> {
    try {
      const tableName = DOCUMENT_TABLE_MAP[entityType];
      const entityIdField = ENTITY_ID_FIELD_MAP[entityType];
      
      // Query the appropriate table with explicit table references to avoid type recursion
      let query;
      if (tableName === POLICY_DOCUMENTS) {
        query = supabase.from(POLICY_DOCUMENTS);
      } else if (tableName === CLAIM_DOCUMENTS) {
        query = supabase.from(CLAIM_DOCUMENTS);
      } else if (tableName === SALES_DOCUMENTS) {
        query = supabase.from(SALES_DOCUMENTS);
      } else {
        throw new Error(`Unsupported document table: ${tableName}`);
      }
      
      const { data, error } = await query
        .select('*')
        .eq(entityIdField, entityId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to our Document type
      return (data || []).map((item: any) => ({
        id: item.id,
        document_name: item.document_name,
        document_type: item.document_type,
        created_at: item.created_at,
        file_path: item.file_path,
        entity_type: entityType,
        entity_id: item[entityIdField],
        uploaded_by_id: item.uploaded_by,
        uploaded_by_name: item.uploaded_by_name || "",
        description: item.description || "",
        version: item.version || 1,
        status: item.status || "active",
        tags: item.tags || [],
        category: (item.category || "other") as DocumentCategory,
        mime_type: item.mime_type || "",
        is_latest_version: item.is_latest_version || true,
        original_document_id: item.original_document_id || null,
        approval_status: item.approval_status || "pending"
      }));
    } catch (error) {
      console.error(`Error fetching ${entityType} documents:`, error);
      return [];
    }
  }

  /**
   * Delete a document
   */
  static async deleteDocument(entityType: EntityType, documentId: string): Promise<boolean> {
    try {
      const tableName = DOCUMENT_TABLE_MAP[entityType];
      
      // Get document info first to retrieve file path - using explicit reference
      let fetchQuery;
      if (tableName === POLICY_DOCUMENTS) {
        fetchQuery = supabase.from(POLICY_DOCUMENTS);
      } else if (tableName === CLAIM_DOCUMENTS) {
        fetchQuery = supabase.from(CLAIM_DOCUMENTS);
      } else if (tableName === SALES_DOCUMENTS) {
        fetchQuery = supabase.from(SALES_DOCUMENTS);
      } else {
        throw new Error(`Unsupported document table: ${tableName}`);
      }
      
      const { data: document, error: fetchError } = await fetchQuery
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;

      // Delete document record from database
      let deleteQuery;
      if (tableName === POLICY_DOCUMENTS) {
        deleteQuery = supabase.from(POLICY_DOCUMENTS);
      } else if (tableName === CLAIM_DOCUMENTS) {
        deleteQuery = supabase.from(CLAIM_DOCUMENTS);
      } else if (tableName === SALES_DOCUMENTS) {
        deleteQuery = supabase.from(SALES_DOCUMENTS);
      }
      
      const { error } = await deleteQuery
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      // Delete file from storage if exists
      if (document && document.file_path) {
        await supabase.storage
          .from('documents')
          .remove([document.file_path]);
      }

      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      return false;
    }
  }

  /**
   * Get document download URL
   */
  static async getDownloadUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 60); // URL valid for 60 seconds

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Error generating download URL:", error);
      throw error;
    }
  }
  
  /**
   * Get document versions
   */
  static async getDocumentVersions(documentId: string, entityType: EntityType): Promise<Document[]> {
    try {
      const tableName = DOCUMENT_TABLE_MAP[entityType];
      
      // Get the original document first - using explicit table reference
      let fetchQuery;
      if (tableName === POLICY_DOCUMENTS) {
        fetchQuery = supabase.from(POLICY_DOCUMENTS);
      } else if (tableName === CLAIM_DOCUMENTS) {
        fetchQuery = supabase.from(CLAIM_DOCUMENTS);
      } else if (tableName === SALES_DOCUMENTS) {
        fetchQuery = supabase.from(SALES_DOCUMENTS);
      } else {
        throw new Error(`Unsupported document table: ${tableName}`);
      }
      
      const { data: document, error: fetchError } = await fetchQuery
        .select('*')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;
      
      // Safety check
      if (!document) {
        return [];
      }

      const originalId = document.original_document_id || documentId;
      const entityIdField = ENTITY_ID_FIELD_MAP[entityType];
      const entityId = document[entityIdField];

      // Get all versions (both original and versions pointing to it)
      let versionsQuery;
      if (tableName === POLICY_DOCUMENTS) {
        versionsQuery = supabase.from(POLICY_DOCUMENTS);
      } else if (tableName === CLAIM_DOCUMENTS) {
        versionsQuery = supabase.from(CLAIM_DOCUMENTS);
      } else if (tableName === SALES_DOCUMENTS) {
        versionsQuery = supabase.from(SALES_DOCUMENTS);
      }
      
      const { data: versions, error } = await versionsQuery
        .select('*')
        .or(`original_document_id.eq.${originalId},id.eq.${originalId}`)
        .eq(entityIdField, entityId)
        .order('version', { ascending: false });

      if (error) throw error;

      // Map to Document type
      return (versions || []).map((item: any) => ({
        id: item.id,
        document_name: item.document_name,
        document_type: item.document_type,
        created_at: item.created_at,
        file_path: item.file_path,
        entity_type: entityType,
        entity_id: item[entityIdField],
        uploaded_by_id: item.uploaded_by,
        uploaded_by_name: item.uploaded_by_name || "",
        description: item.description || "",
        version: item.version || 1,
        status: item.status || "active",
        tags: item.tags || [],
        category: (item.category || "other") as DocumentCategory,
        mime_type: item.mime_type || "",
        is_latest_version: item.is_latest_version || true,
        original_document_id: item.original_document_id || null,
        approval_status: item.approval_status || "pending"
      }));
    } catch (error) {
      console.error("Error fetching document versions:", error);
      return [];
    }
  }
}
